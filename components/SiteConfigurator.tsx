'use client'

import { useMemo, useRef, useState } from 'react'
import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { formatPrice } from '@/lib/money'
import {
  DELAYS,
  OPTIONS,
  PACKS,
  PLANS,
  type Currency,
  type DelayId,
  type OptionId,
  type PackId,
  type PlanId,
} from '@/lib/prices'
import { DEFAULT_CURRENCY } from '@/lib/currency'
import { track } from '@/lib/analytics'
import { Tbf } from './Tbd'

/**
 * Le configurateur de sites.
 *
 * Le visiteur choisit son pack, ses options, son delai et son abonnement, et
 * le prix se met a jour. L'email n'est demande qu'au moment d'envoyer
 * l'estimation, jamais avant de l'afficher.
 *
 * Tous les montants viennent de `lib/prices.ts`. Les options comprises dans un
 * pack sont deduites des plus cheres choisies, ce qui est la lecture la plus
 * favorable au client, et la regle est ecrite a l'ecran. Un montant non fixe
 * dans la devise affichee fait tomber le total sur l'emplacement [À FIXER] :
 * additionner en ignorant une ligne donnerait un faux prix.
 */
export default function SiteConfigurator({ locale }: { locale: Locale }) {
  const t = dict(locale).configurator
  const money = dict(locale).pricing

  const [pack, setPack] = useState<PackId>('pro')
  const [chosen, setChosen] = useState<OptionId[]>([])
  const [delay, setDelay] = useState<DelayId>('economie')
  const [plan, setPlan] = useState<PlanId | ''>('croissance')
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error'>('idle')
  const opened = useRef(Date.now())

  const current = PACKS.find((p) => p.id === pack)!
  const expressAllowed = DELAYS.find((d) => d.id === 'express')!.only!.includes(pack)
  const effectiveDelay: DelayId = delay === 'express' && !expressAllowed ? 'standard' : delay

  /**
   * Le total, dans les deux devises.
   *
   * Calcule devise par devise, parce qu'une ligne peut etre fixee dans l'une
   * et pas dans l'autre : le total vaut alors `null` dans celle qui manque.
   */
  const totals = useMemo(() => {
    const compute = (currency: Currency) => {
      const planPrice = plan ? PLANS.find((p) => p.id === plan)!.price : null
      const monthly =
        planPrice && planPrice.kind === 'fixed' ? planPrice.amount[currency] : null

      // un pack sur devis ne se chiffre pas, mais son abonnement, si
      if (current.price.kind === 'quote') return { setup: 'quote' as const, monthly }

      const packValue =
        current.price.kind === 'fixed' ? current.price.amount[currency] : null
      if (packValue === null) return { setup: null, monthly: null }

      // les options choisies, avec leur prix dans cette devise
      const picked = chosen
        .filter((id) => !(current.free ?? []).includes(id))
        .map((id) => {
          const option = OPTIONS.find((o) => o.id === id)!
          if (option.price.kind === 'free') return { id, value: 0 }
          if (option.price.kind !== 'fixed') return { id, value: null }
          return { id, value: option.price.amount[currency] }
        })
      if (picked.some((o) => o.value === null)) return { setup: null, monthly: null }

      // les plus cheres sont offertes, autant que le pack en comprend
      const values = picked.map((o) => o.value as number).sort((a, b) => b - a)
      const paid = values.slice(current.included ?? 0).reduce((sum, v) => sum + v, 0)

      const rule = DELAYS.find((d) => d.id === effectiveDelay)!.price
      const extra = rule.kind === 'percent' ? rule.value / 100 : 0
      const setup = Math.round((packValue + paid) * (1 + extra))
      return { setup, monthly }
    }
    return { EUR: compute('EUR'), USD: compute('USD') }
  }, [chosen, current, effectiveDelay, plan])

  /** Les options offertes, pour l'affichage. */
  const freeNow = useMemo(() => {
    const free = new Set<OptionId>(current.free ?? [])
    const paidOnes = chosen
      .filter((id) => !free.has(id))
      .map((id) => {
        const option = OPTIONS.find((o) => o.id === id)!
        const value =
          option.price.kind === 'fixed'
            ? (option.price.amount[DEFAULT_CURRENCY] ?? 0)
            : 0
        return { id, value }
      })
      .sort((a, b) => b.value - a.value)
    paidOnes.slice(0, current.included ?? 0).forEach((o) => free.add(o.id))
    return free
  }, [chosen, current])

  const toggle = (id: OptionId) => {
    setChosen((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
    track('configurator_start')
  }

  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setState('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'configurator',
          locale,
          email: String(form.get('email') ?? '').trim(),
          name: String(form.get('name') ?? '').trim(),
          consent: true,
          estimate: { pack, options: chosen, delay: effectiveDelay, plan, totals },
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

  const amount = (value: number | null | 'quote', currency: Currency) =>
    value === 'quote' ? (
      formatPrice({ kind: 'quote' }, currency, locale)
    ) : value === null ? (
      <Tbf locale={locale} />
    ) : (
      // le total porte la mention hors taxes, comme toute la grille
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

  return (
    <div className="conf">
      <div className="conf__head">
        <h3 className="conf__title">{t.title}</h3>
        <p className="muted small">{t.lead}</p>
      </div>

      <div className="conf__grid">
        <fieldset className="conf__group">
          <legend>{t.pack}</legend>
          {PACKS.map((item) => (
            <label className="conf__row" key={item.id}>
              <input
                type="radio"
                name="pack"
                value={item.id}
                checked={pack === item.id}
                onChange={() => {
                  setPack(item.id)
                  track('configurator_start')
                }}
              />
              <span className="conf__label">{money.packs.rows[item.id].name}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="conf__group">
          <legend>{t.options}</legend>
          {OPTIONS.map((item) => (
            <label className="conf__row" key={item.id}>
              <input
                type="checkbox"
                checked={chosen.includes(item.id)}
                onChange={() => toggle(item.id)}
              />
              <span className="conf__label">{money.options.rows[item.id]}</span>
              {chosen.includes(item.id) && freeNow.has(item.id) ? (
                <span className="conf__free">{t.included}</span>
              ) : null}
            </label>
          ))}
          <p className="conf__note">{t.includedNote}</p>
        </fieldset>

        <fieldset className="conf__group">
          <legend>{t.delay}</legend>
          {DELAYS.map((item) => {
            const off = item.id === 'express' && !expressAllowed
            return (
              <label className="conf__row" key={item.id} data-off={off || undefined}>
                <input
                  type="radio"
                  name="delay"
                  value={item.id}
                  checked={effectiveDelay === item.id}
                  disabled={off}
                  onChange={() => setDelay(item.id)}
                />
                <span className="conf__label">{money.delays.rows[item.id]}</span>
              </label>
            )
          })}
        </fieldset>

        <fieldset className="conf__group">
          <legend>{t.plan}</legend>
          <label className="conf__row">
            <input
              type="radio"
              name="plan"
              checked={plan === ''}
              onChange={() => setPlan('')}
            />
            <span className="conf__label">{t.noPlan}</span>
          </label>
          {PLANS.map((item) => (
            <label className="conf__row" key={item.id}>
              <input
                type="radio"
                name="plan"
                value={item.id}
                checked={plan === item.id}
                onChange={() => setPlan(item.id)}
              />
              <span className="conf__label">{money.plans.rows[item.id]}</span>
            </label>
          ))}
        </fieldset>
      </div>

      {/* le recapitulatif : les deux devises, comme partout */}
      <div className="conf__total">
        <div>
          <span className="conf__total-label">{t.setup}</span>
          <strong className="conf__total-value price">
            <span data-cur="EUR">{amount(totals.EUR.setup, 'EUR')}</span>
            <span data-cur="USD">{amount(totals.USD.setup, 'USD')}</span>
          </strong>
        </div>
        {plan ? (
          <div>
            <span className="conf__total-label">{t.monthly}</span>
            <strong className="conf__total-value price">
              <span data-cur="EUR">{amount(totals.EUR.monthly, 'EUR')}</span>
              <span data-cur="USD">{amount(totals.USD.monthly, 'USD')}</span>
            </strong>
          </div>
        ) : null}

        <div className="conf__send">
          {current.price.kind === 'quote' ? <p className="small muted">{t.quoteNote}</p> : null}
          {state === 'done' ? (
            <div className="notice" role="status">
              <p style={{ margin: 0 }}>{t.sent}</p>
            </div>
          ) : state === 'idle' ? (
            <button className="btn btn--primary" type="button" onClick={() => setState('form')}>
              {t.send}
            </button>
          ) : (
            <form className="conf__form" onSubmit={send}>
              <div className="field">
                <label htmlFor="conf-email">{t.email}</label>
                <input id="conf-email" name="email" type="email" required autoComplete="email" />
                <span className="field__hint">{t.emailNote}</span>
              </div>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="conf-trap">Company URL</label>
                <input id="conf-trap" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <label className="consent" htmlFor="conf-consent">
                <input id="conf-consent" type="checkbox" required />
                <span>{t.consent}</span>
              </label>
              {state === 'error' ? (
                <div className="notice notice--error" role="alert">
                  <p style={{ margin: 0 }}>{t.failed}</p>
                </div>
              ) : null}
              <button className="btn btn--primary" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? t.sending : t.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
