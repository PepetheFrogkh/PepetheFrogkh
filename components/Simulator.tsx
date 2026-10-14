'use client'

import { useMemo, useRef, useState } from 'react'
import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { formatPrice } from '@/lib/money'
import { AUTOMATION, type Currency } from '@/lib/prices'
import {
  ACTIONS,
  TOOLS,
  TRIGGERS,
  type ActionId,
  type Block,
  type Family,
  type Flow,
  type ToolId,
  type TriggerId,
  tally,
} from '@/lib/simulator'
import { track } from '@/lib/analytics'
import { Tbf } from './Tbd'

/**
 * Le simulateur d'automatisation.
 *
 * Un editeur de flux : le visiteur ajoute des blocs relies les uns aux autres,
 * et le prix se met a jour en direct. Il n'estime, rien d'autre.
 *
 * Le calcul suit la grille : le premier flux simple compte le prix du flux,
 * chaque condition ajoute son prix, chaque application connectee le sien, et
 * un outil sans API ouverte ajoute le sien, avec l'explication du cahier
 * affichee a cote de la question. La supervision suit le nombre de flux.
 *
 * Sur mobile, le canevas devient une liste d'etapes : relier des blocs au
 * pouce ne marche pas. C'est la meme structure de donnees, affichee
 * autrement, donc le prix est le meme.
 *
 * Le clavier suffit a tout faire : chaque bloc s'ajoute par un bouton et se
 * retire par un bouton, il n'y a rien a glisser.
 */

let counter = 0
const nextKey = (prefix: string) => `${prefix}-${++counter}`

export default function Simulator({ locale }: { locale: Locale }) {
  const t = dict(locale).simulator
  const money = dict(locale).pricing
  const [flows, setFlows] = useState<Flow[]>([
    { key: nextKey('flow'), blocks: [{ key: nextKey('b'), family: 'trigger', id: 'form' }] },
  ])
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error'>('idle')
  const opened = useRef(Date.now())

  const counts = useMemo(() => tally(flows), [flows])

  /** Le total, devise par devise : une ligne non fixee fait tomber le total. */
  const totals = useMemo(() => {
    const compute = (currency: Currency) => {
      const line = (price: typeof AUTOMATION.flow) =>
        price.kind === 'fixed' ? price.amount[currency] : null

      const flow = line(AUTOMATION.flow)
      const condition = line(AUTOMATION.condition)
      const app = line(AUTOMATION.app)
      const noApi = line(AUTOMATION.noApi)

      // On additionne ce qui est fixe, et on nomme ce qui ne l'est pas. Un
      // total qui disparait entierement des qu'une ligne manque n'aide
      // personne ; un total qui absorbe la ligne manquante serait faux.
      const missing: string[] = []
      const part = (count: number, value: number | null, name: string) => {
        if (count === 0) return 0
        if (value === null) {
          missing.push(name)
          return 0
        }
        return count * value
      }

      const setup =
        part(counts.flows, flow, money.automation.rows.flow) +
        part(counts.conditions, condition, money.automation.rows.condition) +
        part(counts.apps, app, money.automation.rows.app) +
        part(counts.closedApis, noApi, money.automation.rows.noApi)

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

  const addBlock = (flowKey: string, family: Family, id: Block['id']) =>
    change((list) =>
      list.map((flow) =>
        flow.key === flowKey
          ? {
              ...flow,
              blocks: [
                ...flow.blocks,
                { key: nextKey('b'), family, id, ...(family === 'tool' ? { openApi: null } : {}) },
              ],
            }
          : flow,
      ),
    )

  const removeBlock = (flowKey: string, blockKey: string) =>
    change((list) =>
      list.map((flow) =>
        flow.key === flowKey
          ? { ...flow, blocks: flow.blocks.filter((b) => b.key !== blockKey) }
          : flow,
      ),
    )

  const setApi = (flowKey: string, blockKey: string, open: boolean | null) =>
    change((list) =>
      list.map((flow) =>
        flow.key === flowKey
          ? {
              ...flow,
              blocks: flow.blocks.map((b) => (b.key === blockKey ? { ...b, openApi: open } : b)),
            }
          : flow,
      ),
    )

  const label = (block: Block): string => {
    if (block.family === 'condition') return t.condition
    if (block.family === 'trigger') return t.triggers[block.id as TriggerId]
    if (block.family === 'tool') return t.tools[block.id as ToolId]
    return t.actions[block.id as ActionId]
  }

  const amount = (value: number | null | 'quote', currency: Currency) =>
    value === 'quote' ? (
      formatPrice({ kind: 'quote' }, currency, locale)
    ) : value === null ? (
      <Tbf locale={locale} />
    ) : (
      formatPrice(
        {
          kind: 'fixed',
          amount: {
            EUR: currency === 'EUR' ? value : null,
            USD: currency === 'USD' ? value : null,
          },
        },
        currency,
        locale,
      )
    )

  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setState('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'simulator',
          locale,
          email: String(form.get('email') ?? '').trim(),
          consent: true,
          estimate: { counts, totals, flows },
          trap: String(form.get('company_url') ?? ''),
          elapsed: Date.now() - opened.current,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      track('price_shown')
      setState('done')
    } catch {
      setState('error')
    }
  }

  const conf = dict(locale).configurator

  return (
    <div className="sim">
      <div className="conf__head">
        <h3 className="conf__title">{t.title}</h3>
        <p className="muted small">{t.lead}</p>
      </div>

      <div className="sim__flows">
        {flows.map((flow, index) => (
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

            {/* Les blocs du flux. Sur grand ecran ils s'enchainent de gauche a
                droite ; sous 760 px ils deviennent une liste d'etapes. */}
            <ol className="sim__chain" aria-label={t.steps}>
              {flow.blocks.length === 0 ? <li className="sim__empty">{t.empty}</li> : null}
              {flow.blocks.map((block) => (
                <li className="sim__block" data-family={block.family} key={block.key}>
                  <div className="sim__block-head">
                    <span className="sim__family">
                      {block.family === 'trigger'
                        ? t.trigger
                        : block.family === 'tool'
                          ? t.tool
                          : block.family === 'condition'
                            ? t.condition
                            : t.action}
                    </span>
                    <button
                      className="sim__remove"
                      type="button"
                      aria-label={`${t.remove} ${label(block)}`}
                      onClick={() => removeBlock(flow.key, block.key)}
                    >
                      ×
                    </button>
                  </div>
                  <span className="sim__name">{label(block)}</span>

                  {block.family === 'tool' ? (
                    <div className="sim__api">
                      <span className="sim__api-q">{t.apiQuestion}</span>
                      <div className="sim__api-row">
                        {[
                          { value: true, text: t.apiYes },
                          { value: false, text: t.apiNo },
                          { value: null, text: t.apiUnknown },
                        ].map((choice) => (
                          <button
                            className="sim__chip"
                            type="button"
                            key={String(choice.value)}
                            aria-pressed={block.openApi === choice.value}
                            onClick={() => setApi(flow.key, block.key, choice.value)}
                          >
                            {choice.text}
                          </button>
                        ))}
                      </div>
                      {block.openApi === false ? (
                        <p className="sim__warn">{t.apiWarning}</p>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>

            {/* le catalogue : tout s'ajoute au bouton, rien ne se glisse */}
            <div className="sim__add">
              <Group title={t.trigger}>
                {TRIGGERS.map((id) => (
                  <button
                    className="sim__chip"
                    type="button"
                    key={id}
                    onClick={() => addBlock(flow.key, 'trigger', id)}
                  >
                    {t.triggers[id]}
                  </button>
                ))}
              </Group>
              <Group title={t.tool}>
                {TOOLS.map((id) => (
                  <button
                    className="sim__chip"
                    type="button"
                    key={id}
                    onClick={() => addBlock(flow.key, 'tool', id)}
                  >
                    {t.tools[id]}
                  </button>
                ))}
              </Group>
              <Group title={t.condition}>
                <button
                  className="sim__chip"
                  type="button"
                  onClick={() => addBlock(flow.key, 'condition', 'condition')}
                >
                  {t.add}
                </button>
              </Group>
              <Group title={t.action}>
                {ACTIONS.map((id) => (
                  <button
                    className="sim__chip"
                    type="button"
                    key={id}
                    onClick={() => addBlock(flow.key, 'action', id)}
                  >
                    {t.actions[id]}
                  </button>
                ))}
              </Group>
            </div>
          </div>
        ))}

        <button
          className="btn btn--secondary btn--small"
          type="button"
          onClick={() =>
            change((list) => [
              ...list,
              { key: nextKey('flow'), blocks: [{ key: nextKey('b'), family: 'trigger', id: 'form' }] },
            ])
          }
        >
          {t.addFlow}
        </button>
      </div>

      {/* le recapitulatif, fixe au bas du simulateur */}
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
