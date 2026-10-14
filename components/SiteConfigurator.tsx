'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { formatPrice } from '@/lib/money'
import {
  DELAYS,
  MAX_PAGES,
  OPTIONS,
  PLANS,
  packForPages,
  type Currency,
  type DelayId,
  type OptionId,
  type PlanId,
} from '@/lib/prices'
import { DEFAULT_CURRENCY } from '@/lib/currency'
import { track } from '@/lib/analytics'
import { Tbf } from './Tbd'

/**
 * Le configurateur de sites, en quatre questions.
 *
 * Le visiteur ne choisit pas un pack : il dit combien de pages il lui faut, ce
 * qu'il veut dessus, pour quand, et ce qu'il attend apres la livraison. Le
 * pack s'en deduit. C'est l'inverse de la grille de prix, qui demande de la
 * comprendre avant de s'en servir.
 *
 * Une etape, une question, un ecran. Le total reste visible en haut du premier
 * clic jusqu'au dernier : a aucun moment le prix n'est cache pour forcer la
 * suite, et l'email n'est demande qu'apres l'avoir montre.
 *
 * Tous les montants viennent de `lib/prices.ts`. Les options comprises dans un
 * pack sont deduites des plus cheres choisies, ce qui est la lecture la plus
 * favorable au client, et la regle est ecrite a l'ecran. Un montant non fixe
 * dans la devise affichee fait tomber le total sur l'emplacement [À FIXER] :
 * additionner en ignorant une ligne donnerait un faux prix.
 */

/** Les options qui ne se choisissent pas ici : la page se compte a l'etape 1. */
const HIDDEN: OptionId[] = ['page']

const STEPS = 5
/** L'etape du resultat, la derniere. */
const RESULT = STEPS - 1

/**
 * Un montant qui monte jusqu'a sa nouvelle valeur.
 *
 * Le chiffre juste est dans le DOM des le premier rendu, et l'animation ne
 * part que d'une valeur deja affichee vers une autre : le prix n'est donc
 * jamais faux au repos, ni masque pendant qu'il change. Mouvement reduit : le
 * nombre saute directement a sa valeur.
 */
function Climb({
  value,
  currency,
  locale,
}: {
  value: number
  currency: Currency
  locale: Locale
}) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still || from.current === value) {
      from.current = value
      setShown(value)
      return
    }
    const start = performance.now()
    const origin = from.current
    const span = 420
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / span)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(origin + (value - origin) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
      else from.current = value
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <>{formatPrice({ kind: 'fixed', amount: oneWay(shown, currency) }, currency, locale)}</>
}

/** Un montant dans une seule devise : l'autre colonne a son propre rendu. */
function oneWay(value: number, currency: Currency) {
  return { EUR: currency === 'EUR' ? value : null, USD: currency === 'USD' ? value : null }
}

export default function SiteConfigurator({ locale }: { locale: Locale }) {
  const t = dict(locale).configurator
  const money = dict(locale).pricing

  const [step, setStep] = useState(0)
  /** L'etape la plus loin atteinte : on peut y revenir d'un clic. */
  const [seen, setSeen] = useState(0)
  const [pages, setPages] = useState(3)
  const [chosen, setChosen] = useState<OptionId[]>([])
  const [delay, setDelay] = useState<DelayId>('economie')
  const [plan, setPlan] = useState<PlanId | ''>('croissance')
  const [state, setState] = useState<'idle' | 'form' | 'sending' | 'done' | 'error'>('idle')
  const opened = useRef(Date.now())
  const heading = useRef<HTMLParagraphElement>(null)
  /** Le premier rendu ne deplace pas le focus : seule une navigation le fait. */
  const moved = useRef(false)

  const current = packForPages(pages)
  const pack = current.id
  const expressAllowed = DELAYS.find((d) => d.id === 'express')!.only!.includes(pack)
  const effectiveDelay: DelayId = delay === 'express' && !expressAllowed ? 'standard' : delay

  const go = (next: number) => {
    const target = Math.max(0, Math.min(RESULT, next))
    moved.current = true
    setStep(target)
    setSeen((max) => Math.max(max, target))
    if (target === RESULT) track('price_shown')
    else track('configurator_start')
  }

  /** La question de l'etape est annoncee quand elle change, pas avant. */
  useEffect(() => {
    if (moved.current) heading.current?.focus()
  }, [step])

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

  const restart = () => {
    setPages(3)
    setChosen([])
    setDelay('economie')
    setPlan('croissance')
    setState('idle')
    go(0)
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
          estimate: { pages, pack, options: chosen, delay: effectiveDelay, plan, totals },
          trap: String(form.get('company_url') ?? ''),
          elapsed: Date.now() - opened.current,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('done')
    } catch {
      setState('error')
    }
  }

  /** Un montant du recapitulatif, sans animation. */
  const amount = (value: number | null | 'quote', currency: Currency) =>
    value === 'quote' ? (
      formatPrice({ kind: 'quote' }, currency, locale)
    ) : value === null ? (
      <Tbf locale={locale} />
    ) : (
      formatPrice({ kind: 'fixed', amount: oneWay(value, currency) }, currency, locale)
    )

  /** Le gros total : il monte quand il change, sinon il est juste la. */
  const climbing = (value: number | null | 'quote', currency: Currency) =>
    typeof value === 'number' ? (
      <Climb value={value} currency={currency} locale={locale} />
    ) : (
      amount(value, currency)
    )

  const optionPrice = (id: OptionId, currency: Currency) => {
    const price = OPTIONS.find((o) => o.id === id)!.price
    return formatPrice(price, currency, locale)
  }

  const pagesLabel = `${pages}${pages > MAX_PAGES ? '+' : ''}`
  const question = t.steps[step]

  return (
    <div className="conf wiz">
      <div className="wiz__top">
        <div>
          <h3 className="conf__title">{t.title}</h3>
          <p className="muted small" style={{ margin: 0 }}>
            {t.lead}
          </p>
        </div>

        {/* le total suit le visiteur des le premier clic, y compris pendant
            les questions : rien n'est garde pour la fin */}
        <div className="wiz__tally" aria-live="polite">
          <span className="wiz__tally-label">{t.runningTotal}</span>
          <strong className="wiz__tally-value price" key={String(totals.EUR.setup)}>
            <span data-cur="EUR">{amount(totals.EUR.setup, 'EUR')}</span>
            <span data-cur="USD">{amount(totals.USD.setup, 'USD')}</span>
          </strong>
        </div>
      </div>

      {/* le rail d'etapes : on y revient d'un clic, jamais en avant d'un cran
          qu'on n'a pas encore vu */}
      <ol className="wiz__rail">
        {t.steps.map((item, i) => (
          <li className="wiz__rail-item" key={item.short}>
            <button
              type="button"
              className="wiz__dot"
              data-on={i === step || undefined}
              data-done={i < step || undefined}
              disabled={i > seen}
              aria-current={i === step ? 'step' : undefined}
              onClick={() => go(i)}
            >
              <span className="wiz__dot-num">{i + 1}</span>
              <span className="wiz__dot-name">{item.short}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="wiz__stage">
        <p className="wiz__step" tabIndex={-1} ref={heading}>
          <span className="wiz__count">{t.stepOf(step + 1, STEPS)}</span>
          <span className="wiz__question">{question.question}</span>
          <span className="wiz__help">{question.help}</span>
        </p>

        {/* ── 1. combien de pages ─────────────────────────────────────── */}
        {step === 0 ? (
          <div className="wiz__pages">
            <div className="wiz__counter">
              <button
                type="button"
                className="wiz__step-btn"
                onClick={() => setPages((n) => Math.max(1, n - 1))}
                disabled={pages <= 1}
                aria-label="-1"
              >
                −
              </button>
              <span className="wiz__number" aria-hidden="true">
                {pagesLabel}
              </span>
              <button
                type="button"
                className="wiz__step-btn"
                onClick={() => setPages((n) => Math.min(MAX_PAGES + 1, n + 1))}
                disabled={pages > MAX_PAGES}
                aria-label="+1"
              >
                +
              </button>
            </div>

            <label className="wiz__slider-label" htmlFor="wiz-pages">
              {pages > MAX_PAGES
                ? `${MAX_PAGES} ${t.pagesUnit(MAX_PAGES)} ${t.pagesMore}`
                : `${pages} ${t.pagesUnit(pages)}`}
            </label>
            <input
              id="wiz-pages"
              className="wiz__slider"
              type="range"
              min={1}
              max={MAX_PAGES + 1}
              step={1}
              value={pages}
              // la part remplie de la piste suit la valeur : WebKit ne sait pas
              // la peindre seul des qu'on redessine la piste
              style={{ '--fill': `${((pages - 1) / MAX_PAGES) * 100}%` } as CSSProperties}
              onChange={(e) => {
                setPages(Number(e.currentTarget.value))
                track('configurator_start')
              }}
            />

            <p className="wiz__pack">
              <span className="wiz__pack-label">{t.packIs}</span>
              <strong className="wiz__pack-name">{money.packs.rows[pack].name}</strong>
              <span className="muted small">{money.packs.rows[pack].detail}</span>
            </p>
          </div>
        ) : null}

        {/* ── 2. les options ──────────────────────────────────────────── */}
        {step === 1 ? (
          <>
            <div className="wiz__cards">
              {OPTIONS.filter((o) => !HIDDEN.includes(o.id)).map((item) => {
                const on = chosen.includes(item.id)
                return (
                  <button
                    type="button"
                    className="wiz__card"
                    key={item.id}
                    data-on={on || undefined}
                    aria-pressed={on}
                    onClick={() => toggle(item.id)}
                  >
                    <span className="wiz__card-name">{money.options.rows[item.id]}</span>
                    {on && freeNow.has(item.id) ? (
                      <span className="conf__free">{t.included}</span>
                    ) : (
                      <span className="wiz__card-price price">
                        <span data-cur="EUR">
                          {optionPrice(item.id, 'EUR') ?? <Tbf locale={locale} />}
                        </span>
                        <span data-cur="USD">
                          {optionPrice(item.id, 'USD') ?? <Tbf locale={locale} />}
                        </span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="conf__note">{t.includedNote}</p>
          </>
        ) : null}

        {/* ── 3. le delai ─────────────────────────────────────────────── */}
        {step === 2 ? (
          <div className="wiz__cards wiz__cards--wide">
            {DELAYS.map((item) => {
              const off = item.id === 'express' && !expressAllowed
              return (
                <button
                  type="button"
                  className="wiz__card"
                  key={item.id}
                  data-on={effectiveDelay === item.id || undefined}
                  aria-pressed={effectiveDelay === item.id}
                  disabled={off}
                  onClick={() => {
                    setDelay(item.id)
                    track('configurator_start')
                  }}
                >
                  <span className="wiz__card-name">{money.delays.rows[item.id]}</span>
                  <span className="wiz__card-price price">
                    {formatPrice(item.price, DEFAULT_CURRENCY, locale)}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}

        {/* ── 4. le suivi ─────────────────────────────────────────────── */}
        {step === 3 ? (
          <div className="wiz__cards wiz__cards--wide">
            <button
              type="button"
              className="wiz__card"
              data-on={plan === '' || undefined}
              aria-pressed={plan === ''}
              onClick={() => setPlan('')}
            >
              <span className="wiz__card-name">{t.noPlan}</span>
            </button>
            {PLANS.map((item) => (
              <button
                type="button"
                className="wiz__card"
                key={item.id}
                data-on={plan === item.id || undefined}
                aria-pressed={plan === item.id}
                onClick={() => {
                  setPlan(item.id)
                  track('configurator_start')
                }}
              >
                <span className="wiz__card-name">{money.plans.rows[item.id]}</span>
                <span className="wiz__card-price price">
                  <span data-cur="EUR">
                    {formatPrice(item.price, 'EUR', locale) ?? <Tbf locale={locale} />}
                  </span>
                  <span data-cur="USD">
                    {formatPrice(item.price, 'USD', locale) ?? <Tbf locale={locale} />}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {/* ── 5. le prix ──────────────────────────────────────────────── */}
        {step === RESULT ? (
          <div className="wiz__result">
            <div className="wiz__price">
              <span className="conf__total-label">{t.setup}</span>
              <strong className="conf__total-value price">
                <span data-cur="EUR">{climbing(totals.EUR.setup, 'EUR')}</span>
                <span data-cur="USD">{climbing(totals.USD.setup, 'USD')}</span>
              </strong>
              {plan ? (
                <>
                  <span className="conf__total-label">{t.monthly}</span>
                  <strong className="conf__total-value conf__total-value--small price">
                    <span data-cur="EUR">{amount(totals.EUR.monthly, 'EUR')}</span>
                    <span data-cur="USD">{amount(totals.USD.monthly, 'USD')}</span>
                  </strong>
                </>
              ) : null}
            </div>

            <dl className="wiz__recap">
              <dt>{t.recapPages}</dt>
              <dd>
                {pages > MAX_PAGES
                  ? `${MAX_PAGES} ${t.pagesUnit(MAX_PAGES)} ${t.pagesMore}`
                  : `${pages} ${t.pagesUnit(pages)}`}{' '}
                <span className="muted">({money.packs.rows[pack].name})</span>{' '}
                <button type="button" className="wiz__edit" onClick={() => go(0)}>
                  {t.edit}
                </button>
              </dd>
              <dt>{t.recapOptions}</dt>
              <dd>
                {chosen.length
                  ? chosen.map((id) => money.options.rows[id]).join(', ')
                  : t.noOption}{' '}
                <button type="button" className="wiz__edit" onClick={() => go(1)}>
                  {t.edit}
                </button>
              </dd>
              <dt>{t.recapDelay}</dt>
              <dd>
                {money.delays.rows[effectiveDelay]}{' '}
                <button type="button" className="wiz__edit" onClick={() => go(2)}>
                  {t.edit}
                </button>
              </dd>
              <dt>{t.recapPlan}</dt>
              <dd>
                {plan ? money.plans.rows[plan] : t.noPlan}{' '}
                <button type="button" className="wiz__edit" onClick={() => go(3)}>
                  {t.edit}
                </button>
              </dd>
            </dl>

            <div className="conf__send">
              {current.price.kind === 'quote' ? (
                <p className="small muted">{t.quoteNote}</p>
              ) : null}
              {state === 'done' ? (
                <div className="notice" role="status">
                  <p style={{ margin: 0 }}>{t.sent}</p>
                </div>
              ) : state === 'idle' ? (
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={() => setState('form')}
                >
                  {t.send}
                </button>
              ) : (
                <form className="conf__form" onSubmit={send}>
                  <div className="field">
                    <label htmlFor="conf-email">{t.email}</label>
                    <input
                      id="conf-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                    <span className="field__hint">{t.emailNote}</span>
                  </div>
                  <div className="honeypot" aria-hidden="true">
                    <label htmlFor="conf-trap">Company URL</label>
                    <input
                      id="conf-trap"
                      name="company_url"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
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
                  <button
                    className="btn btn--primary"
                    type="submit"
                    disabled={state === 'sending'}
                  >
                    {state === 'sending' ? t.sending : t.send}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="wiz__nav">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => go(step - 1)}
          disabled={step === 0}
        >
          {t.back}
        </button>
        {step === RESULT ? (
          <button type="button" className="btn btn--secondary" onClick={restart}>
            {t.restart}
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={() => go(step + 1)}>
            {step === RESULT - 1 ? t.seeResult : t.next}
          </button>
        )}
      </div>
    </div>
  )
}
