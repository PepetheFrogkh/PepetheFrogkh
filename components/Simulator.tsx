'use client'

import { useMemo, useRef, useState } from 'react'
import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { formatPrice } from '@/lib/money'
import { AUTOMATION, type Currency, type Price } from '@/lib/prices'
import {
  ACTIONS,
  CANVAS,
  TOOLS,
  TOOL_INFO,
  TRIGGERS,
  type ActionId,
  type Family,
  type Flow,
  type FlowNode,
  type NodeId,
  type Slot,
  type Target,
  type ToolId,
  type TriggerId,
  curve,
  detach,
  layout,
  nodeLines,
  tally,
  update,
  walk,
} from '@/lib/simulator'
import { track } from '@/lib/analytics'
import { sendLead } from '@/lib/lead'
import { Tbf } from './Tbd'

/**
 * Le simulateur d'automatisation.
 *
 * Un canevas, comme dans un outil de flux : chaque noeud est une etape, les
 * noeuds sont relies par des cables, et une condition se separe en deux
 * branches, « oui » et « non ». Chaque noeud porte ce qu'il ajoute au prix, et
 * le total en bas est la somme de ce qui est affiche sur le canevas : le
 * visiteur voit d'ou vient le prix.
 *
 * Les positions sont calculees, jamais glissees a la souris. C'est un choix :
 * un canevas qu'on deplace au curseur ne se manipule ni au clavier ni au
 * doigt, et le but est d'estimer, pas de dessiner. On ajoute une etape en
 * cliquant le « + » de la sortie voulue, puis l'etape dans le catalogue.
 *
 * Sous 900 px, le meme arbre devient une liste indentee : les memes donnees,
 * donc le meme prix.
 */

let counter = 0
const nextKey = (prefix: string) => `${prefix}-${++counter}`

const newFlow = (): Flow => ({
  key: nextKey('flow'),
  root: { key: nextKey('n'), family: 'trigger', id: 'form' },
})

export default function Simulator({ locale }: { locale: Locale }) {
  const t = dict(locale).simulator
  const conf = dict(locale).configurator
  const money = dict(locale).pricing

  const [flows, setFlows] = useState<Flow[]>([newFlow()])
  const [target, setTarget] = useState<Target | null>(null)
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error'>('idle')
  const opened = useRef(Date.now())

  const counts = useMemo(() => tally(flows), [flows])

  /** Le total, devise par devise, avec les lignes qui n'ont pas de prix. */
  const totals = useMemo(() => {
    const compute = (currency: Currency) => {
      const value = (price: Price) => (price.kind === 'fixed' ? price.amount[currency] : null)
      const missing: string[] = []
      const part = (count: number, price: Price, name: string) => {
        if (count === 0) return 0
        const unit = value(price)
        if (unit === null) {
          missing.push(name)
          return 0
        }
        return count * unit
      }

      const setup =
        part(counts.flows, AUTOMATION.flow, money.automation.rows.flow) +
        part(counts.conditions, AUTOMATION.condition, money.automation.rows.condition) +
        part(counts.apps, AUTOMATION.app, money.automation.rows.app) +
        part(counts.closedApis, AUTOMATION.noApi, money.automation.rows.noApi)

      const tier = AUTOMATION.supervision.find((s) => counts.flows <= s.flows)!
      const monthly =
        tier.price.kind === 'quote'
          ? ('quote' as const)
          : tier.price.kind === 'fixed'
            ? tier.price.amount[currency]
            : null

      return { setup, monthly, missing }
    }
    return { EUR: compute('EUR'), USD: compute('USD') }
  }, [counts, money])

  const change = (fn: (list: Flow[]) => Flow[]) => {
    setFlows(fn)
    track('configurator_start')
  }

  /** Ajoute une etape a la sortie visee, et replace la suite derriere elle. */
  const add = (family: Family, id: NodeId) => {
    if (!target) return
    const fresh: FlowNode = {
      key: nextKey('n'),
      family,
      id,
      // Pour un outil nomme, la reponse est connue : son editeur documente une
      // API publique, et on ne pose pas une question dont on a la reponse.
      // Pour un outil generique, `null` veut dire que la question n'a pas
      // encore ete posee. « Je ne sais pas » est une reponse a part, et elle
      // n'ajoute rien au prix.
      ...(family === 'tool' ? { openApi: TOOL_INFO[id as ToolId].api } : {}),
    }
    change((list) =>
      list.map((flow) =>
        flow.key !== target.flow
          ? flow
          : {
              ...flow,
              root: update(flow.root, target.node, (node) => {
                const existing = node[target.slot]
                // Une condition n'a pas de suite unique : ce qui suivait passe
                // sur sa branche « oui », qui est le chemin nominal. Sans
                // cela, la suite devenait un noeud orphelin que la mise en
                // page ne dessinait plus.
                const carried =
                  family === 'condition' ? { yes: existing } : { next: existing }
                return { ...node, [target.slot]: { ...fresh, ...carried } }
              }),
            },
      ),
    )
    setTarget(null)
  }

  const remove = (flowKey: string, nodeKey: string) =>
    change((list) =>
      list.map((flow) =>
        flow.key !== flowKey ? flow : { ...flow, root: detach(flow.root, nodeKey) ?? flow.root },
      ),
    )

  /**
   * Change le declencheur d'un noeud.
   *
   * Le premier noeud n'etait pas modifiable : le flux commencait toujours par
   * un formulaire, et le `×` lui etait refuse puisqu'un flux sans declencheur
   * n'a pas de sens. On ne le supprime donc toujours pas, on l'echange, ce qui
   * est ce que le visiteur voulait faire.
   */
  const setTrigger = (flowKey: string, nodeKey: string, id: TriggerId) =>
    change((list) =>
      list.map((flow) =>
        flow.key !== flowKey
          ? flow
          : { ...flow, root: update(flow.root, nodeKey, (node) => ({ ...node, id })) },
      ),
    )

  const setApi = (flowKey: string, nodeKey: string, open: boolean | 'unknown') =>
    change((list) =>
      list.map((flow) =>
        flow.key !== flowKey
          ? flow
          : { ...flow, root: update(flow.root, nodeKey, (node) => ({ ...node, openApi: open })) },
      ),
    )

  const label = (node: FlowNode): string =>
    node.family === 'condition'
      ? t.condition
      : node.family === 'trigger'
        ? t.triggers[node.id as TriggerId]
        : node.family === 'tool'
          ? t.tools[node.id as ToolId]
          : t.actions[node.id as ActionId]

  const familyName = (family: Family) =>
    family === 'trigger' ? t.trigger : family === 'tool' ? t.tool : family === 'condition' ? t.condition : t.action

  /** Ce que ce noeud ajoute au prix, dans les deux devises. */
  const nodePrice = (node: FlowNode) => {
    const lines = nodeLines(node)
    if (lines.length === 0) return null
    const sum = (currency: Currency) => {
      let total = 0
      for (const line of lines) {
        const price = AUTOMATION[line]
        const unit = price.kind === 'fixed' ? price.amount[currency] : null
        if (unit === null) return null
        total += unit
      }
      return total
    }
    return { EUR: sum('EUR'), USD: sum('USD') }
  }

  const amount = (value: number | null | 'quote', currency: Currency, sign = false) =>
    value === 'quote' ? (
      formatPrice({ kind: 'quote' }, currency, locale)
    ) : value === null ? (
      <Tbf locale={locale} />
    ) : (
      <>
        {sign ? '+ ' : ''}
        {formatPrice(
          {
            kind: 'fixed',
            amount: {
              EUR: currency === 'EUR' ? value : null,
              USD: currency === 'USD' ? value : null,
            },
          },
          currency,
          locale,
        )}
      </>
    )

  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setState('sending')
    try {
      await sendLead({
        kind: 'simulator',
        locale,
        email: String(form.get('email') ?? '').trim(),
        consent: true,
        estimate: { counts, totals, flows },
        trap: String(form.get('company_url') ?? ''),
        elapsed: Date.now() - opened.current,
      })
      track('price_shown')
      setState('done')
    } catch {
      setState('error')
    }
  }

  /** Un noeud, sur le canevas comme dans la liste. */
  const NodeCard = ({ flow, node }: { flow: Flow; node: FlowNode }) => {
    const price = nodePrice(node)
    const slots: Slot[] = node.family === 'condition' ? ['yes', 'no'] : ['next']
    return (
      <div className="fnode" data-family={node.family}>
        <div className="fnode__head">
          <span className="fnode__family">{familyName(node.family)}</span>
          {node.key !== flow.root.key ? (
            <button
              className="fnode__x"
              type="button"
              aria-label={`${t.remove} ${label(node)}`}
              onClick={() => remove(flow.key, node.key)}
            >
              ×
            </button>
          ) : null}
        </div>

        <span className="fnode__name">
          {node.family === 'tool' && TOOL_INFO[node.id as ToolId].logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="fnode__logo"
              src={TOOL_INFO[node.id as ToolId].logo as string}
              alt=""
              width={18}
              height={18}
            />
          ) : null}
          {label(node)}
        </span>

        {price ? (
          <span className="fnode__price price">
            <span data-cur="EUR">{amount(price.EUR, 'EUR', true)}</span>
            <span data-cur="USD">{amount(price.USD, 'USD', true)}</span>
          </span>
        ) : (
          <span className="fnode__price fnode__price--none">{t.includedInFlow}</span>
        )}

        {/* Le declencheur s'echange sur place : c'est la premiere chose qu'un
            visiteur veut changer, et il n'y avait aucun moyen de le faire.
            Une liste deroulante et non cinq pastilles : cinq pastilles
            debordaient la carte, qui ne fait que 188 px de large sur le
            canevas, et la carte sortait du cadre. */}
        {node.family === 'trigger' ? (
          <label className="fnode__swap">
            <span className="fnode__api-q">{t.triggerQuestion}</span>
            <select
              className="fnode__select"
              value={node.id}
              onChange={(event) =>
                setTrigger(flow.key, node.key, event.target.value as TriggerId)
              }
            >
              {TRIGGERS.map((id) => (
                <option value={id} key={id}>
                  {t.triggers[id]}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {node.family === 'tool' && TOOL_INFO[node.id as ToolId].api === null ? (
          <div className="fnode__api">
            <span className="fnode__api-q">{t.apiQuestion}</span>
            <span className="fnode__api-row">
              {([
                { value: true, text: t.apiYes },
                { value: false, text: t.apiNo },
                { value: 'unknown', text: t.apiUnknown },
              ] as const).map((choice) => (
                <button
                  className="sim__chip sim__chip--mini"
                  type="button"
                  key={String(choice.value)}
                  aria-pressed={node.openApi === choice.value}
                  onClick={() => setApi(flow.key, node.key, choice.value)}
                >
                  {choice.text}
                </button>
              ))}
            </span>
          </div>
        ) : node.family === 'tool' ? (
          <span className="fnode__api-known">{t.apiKnown}</span>
        ) : null}

        <span className="fnode__outs">
          {slots.map((slot) => {
            const active =
              target?.flow === flow.key && target.node === node.key && target.slot === slot
            return (
              <button
                className="fnode__plus"
                type="button"
                key={slot}
                aria-pressed={active}
                aria-label={`${t.add} · ${slot === 'yes' ? t.yes : slot === 'no' ? t.no : label(node)}`}
                onClick={() =>
                  setTarget(active ? null : { flow: flow.key, node: node.key, slot })
                }
              >
                {slot === 'yes' ? `+ ${t.yes}` : slot === 'no' ? `+ ${t.no}` : '+'}
              </button>
            )
          })}
        </span>
      </div>
    )
  }

  return (
    <div className="sim">
      <div className="conf__head">
        <h3 className="conf__title">{t.title}</h3>
        <p className="muted small">{t.lead}</p>
      </div>

      <div className="sim__flows">
        {flows.map((flow, index) => {
          const plan = layout(flow.root)
          const ordered: FlowNode[] = []
          walk(flow.root, (node) => ordered.push(node))

          return (
            <div className="sim__flow" key={flow.key}>
              <div className="sim__flow-head">
                <h4 className="sim__flow-title">
                  {t.flow} {index + 1}
                </h4>
                {flows.length > 1 ? (
                  <button
                    className="sim__text-btn"
                    type="button"
                    onClick={() => change((list) => list.filter((f) => f.key !== flow.key))}
                  >
                    {t.removeFlow}
                  </button>
                ) : null}
              </div>

              {/* ── le canevas, au-dela de 900 px ─────────────────────────── */}
              <div className="fcanvas" role="group" aria-label={t.steps}>
                <div
                  className="fcanvas__inner"
                  style={{ width: plan.width, height: plan.height }}
                >
                  <svg
                    className="fcanvas__wires"
                    width={plan.width}
                    height={plan.height}
                    aria-hidden="true"
                  >
                    {plan.edges.map((edge) => (
                      <g key={`${edge.from.node.key}-${edge.to.node.key}`}>
                        <path className="fcanvas__wire" d={curve(edge)} />
                        {edge.branch ? (
                          <text
                            className="fcanvas__branch"
                            x={edge.from.x + CANVAS.nodeWidth + 12}
                            y={
                              edge.from.y +
                              CANVAS.nodeHeight / 2 +
                              (edge.branch === 'yes' ? -10 : 18)
                            }
                          >
                            {edge.branch === 'yes' ? t.yes : t.no}
                          </text>
                        ) : null}
                      </g>
                    ))}
                  </svg>

                  {plan.nodes.map((placed) => (
                    <div
                      className="fcanvas__node"
                      key={placed.node.key}
                      style={{ left: placed.x, top: placed.y, width: CANVAS.nodeWidth }}
                    >
                      <NodeCard flow={flow} node={placed.node} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── la meme chose en liste, sous 900 px ───────────────────── */}
              <ol className="fsteps" aria-label={t.steps}>
                {ordered.map((node) => (
                  <li key={node.key}>
                    <NodeCard flow={flow} node={node} />
                  </li>
                ))}
              </ol>

              {/* ── le catalogue : il n'agit que sur la sortie visee ────────
                  Pas de declencheur ici : un flux en a exactement un, et il
                  s'echange sur sa propre carte. On pouvait en ajouter un
                  second au milieu d'un flux, ce qui ne veut rien dire. */}
              <div className="sim__add" data-armed={target?.flow === flow.key || undefined}>
                <p className="sim__hint">
                  {target?.flow === flow.key ? t.addHere : t.pickSlot}
                </p>
                <div className="sim__groups">
                  <Group title={t.tool}>
                    {TOOLS.map((id) => (
                      <Chip
                        key={id}
                        logo={TOOL_INFO[id].logo}
                        disabled={target?.flow !== flow.key}
                        onClick={() => add('tool', id)}
                      >
                        {t.tools[id]}
                      </Chip>
                    ))}
                  </Group>
                  <Group title={t.condition}>
                    <Chip disabled={target?.flow !== flow.key} onClick={() => add('condition', 'condition')}>
                      {t.add}
                    </Chip>
                  </Group>
                  <Group title={t.action}>
                    {ACTIONS.map((id) => (
                      <Chip key={id} disabled={target?.flow !== flow.key} onClick={() => add('action', id)}>
                        {t.actions[id]}
                      </Chip>
                    ))}
                  </Group>
                </div>
              </div>
            </div>
          )
        })}

        <button
          className="btn btn--secondary btn--small"
          type="button"
          onClick={() => change((list) => [...list, newFlow()])}
        >
          {t.addFlow}
        </button>
      </div>

      <div className="sim__summary">
        <div>
          <span className="conf__total-label">{t.setup}</span>
          <strong className="conf__total-value price">
            <span data-cur="EUR">
              {amount(totals.EUR.setup, 'EUR')}
              {totals.EUR.missing.length > 0 ? <Tbf locale={locale} /> : null}
            </span>
            <span data-cur="USD">
              {amount(totals.USD.setup, 'USD')}
              {totals.USD.missing.length > 0 ? <Tbf locale={locale} /> : null}
            </span>
          </strong>
          <span className="sim__missing price">
            <span data-cur="EUR">{totals.EUR.missing.join(', ')}</span>
            <span data-cur="USD">{totals.USD.missing.join(', ')}</span>
          </span>
        </div>
        <div>
          <span className="conf__total-label">{t.monthly}</span>
          <strong className="conf__total-value price">
            <span data-cur="EUR">{amount(totals.EUR.monthly, 'EUR')}</span>
            <span data-cur="USD">{amount(totals.USD.monthly, 'USD')}</span>
          </strong>
        </div>
        <div>
          <span className="conf__total-label">{t.time}</span>
          <span className="sim__time">{t.timeValue}</span>
        </div>

        <div className="conf__send">
          <p className="small muted">{money.disclaimer}</p>
          {state === 'done' ? (
            <div className="notice" role="status">
              <p style={{ margin: 0 }}>{conf.sent}</p>
            </div>
          ) : state === 'idle' ? (
            <button className="btn btn--primary" type="button" onClick={() => setState('form')}>
              {conf.send}
            </button>
          ) : (
            <form className="conf__form" onSubmit={send}>
              <div className="field">
                <label htmlFor="sim-email">{conf.email}</label>
                <input id="sim-email" name="email" type="email" required autoComplete="email" />
                <span className="field__hint">{conf.emailNote}</span>
              </div>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="sim-trap">Company URL</label>
                <input id="sim-trap" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <label className="consent" htmlFor="sim-consent">
                <input id="sim-consent" type="checkbox" required />
                <span>{conf.consent}</span>
              </label>
              {state === 'error' ? (
                <div className="notice notice--error" role="alert">
                  <p style={{ margin: 0 }}>{conf.failed}</p>
                </div>
              ) : null}
              <button className="btn btn--primary" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? conf.sending : conf.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sim__group">
      <span className="sim__group-title">{title}</span>
      <div className="sim__chips">{children}</div>
    </div>
  )
}

function Chip({
  children,
  logo,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  /** Le logo de la marque, pour un outil nomme. */
  logo?: string | null
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button className="sim__chip" type="button" disabled={disabled} onClick={onClick}>
      {logo ? (
        // Le logo double le nom, qui reste ecrit a cote : il decore, donc
        // `alt` est vide. Un lecteur d'ecran lit « Slack », une fois.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="sim__chip-logo" src={logo} alt="" width={16} height={16} />
      ) : null}
      {children}
    </button>
  )
}
