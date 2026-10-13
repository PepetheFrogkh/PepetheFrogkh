'use client'

import { useRef, useState } from 'react'
import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { track } from '@/lib/analytics'

type Errors = Partial<Record<'venue' | 'city' | 'name' | 'email' | 'consent', string>>

/**
 * Le formulaire du diagnostic gratuit.
 *
 * Champs du cahier : nom de l'etablissement, ville, type, lien Google Maps
 * facultatif, votre nom, votre email, case de consentement obligatoire. La
 * protection anti-spam est invisible : un champ leurre hors ecran et le temps
 * passe sur le formulaire, verifies cote serveur. Aucun captcha, donc rien a
 * charger et rien a cliquer.
 */
export default function DiagnosticForm({ locale }: { locale: Locale }) {
  const t = dict(locale).diagnostic.form
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const openedAt = useRef(Date.now())

  if (state === 'done') {
    return (
      <div className="notice" role="status">
        <p style={{ margin: 0 }}>{t.success}</p>
      </div>
    )
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const get = (k: string) => String(form.get(k) ?? '').trim()

    const next: Errors = {}
    if (!get('venue')) next.venue = t.required
    if (!get('city')) next.city = t.required
    if (!get('name')) next.name = t.required
    const email = get('email')
    if (!email) next.email = t.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = t.invalidEmail
    if (!form.get('consent')) next.consent = t.required

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setState('sending')
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venue: get('venue'),
          city: get('city'),
          type: get('type'),
          maps: get('maps'),
          name: get('name'),
          email,
          consent: true,
          locale,
          // anti-spam : le leurre doit rester vide, et le formulaire doit
          // avoir ete ouvert plus de trois secondes
          trap: get('company_url'),
          elapsed: Date.now() - openedAt.current,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      track('diagnostic_submit')
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__pair">
        <Field id="venue" label={t.venue} error={errors.venue} required />
        <Field id="city" label={t.city} error={errors.city} required />
      </div>

      <div className="form__pair">
        <div className="field">
          <label htmlFor="type">{t.type}</label>
          <select id="type" name="type" defaultValue={t.types[0]}>
            {t.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Field id="maps" label={t.maps} hint={t.mapsHint} type="url" />
      </div>

      <div className="form__pair">
        <Field id="name" label={t.name} error={errors.name} required autoComplete="name" />
        <Field
          id="email"
          label={t.email}
          error={errors.email}
          required
          type="email"
          autoComplete="email"
        />
      </div>

      {/* le leurre : hors ecran, hors tabulation, et ignore des lecteurs d'ecran */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company_url">Company URL</label>
        <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label className="consent" htmlFor="consent">
          <input id="consent" name="consent" type="checkbox" required />
          <span>{t.consent}</span>
        </label>
        {errors.consent ? (
          <span className="field__error" role="alert">
            {errors.consent}
          </span>
        ) : null}
      </div>

      {state === 'error' ? (
        <div className="notice notice--error" role="alert">
          <p style={{ margin: 0 }}>{t.error}</p>
        </div>
      ) : null}

      <div>
        <button className="btn btn--primary" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? t.sending : t.submit}
        </button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  type = 'text',
  required = false,
  autoComplete,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  type?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {hint && !error ? (
        <span className="field__hint" id={`${id}-hint`}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}
