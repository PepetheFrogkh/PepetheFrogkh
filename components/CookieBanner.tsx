'use client'

import { useEffect, useState } from 'react'
import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { readConsent, writeConsent } from '@/lib/consent'

/**
 * Accepter, refuser, personnaliser. Aucun traceur avant consentement.
 *
 * Le bandeau ne pose rien lui-meme : il n'ecrit qu'un choix dans le stockage
 * local, et `lib/analytics` refuse d'envoyer quoi que ce soit tant que ce
 * choix n'autorise pas la mesure d'audience.
 */
export default function CookieBanner({ locale }: { locale: Locale }) {
  const t = dict(locale).cookies
  const [asked, setAsked] = useState(true)
  const [detail, setDetail] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    setAsked(readConsent() !== null)
  }, [])

  if (asked) return null

  const decide = (value: boolean) => {
    writeConsent(value)
    setAsked(true)
  }

  return (
    <aside className="cookies" aria-label={t.title}>
      <h2 className="small" style={{ fontWeight: 700, marginBottom: 8 }}>
        {t.title}
      </h2>
      <p className="small muted" style={{ margin: 0 }}>
        {t.body}
      </p>

      {detail ? (
        <div className="cookies__pref">
          <label className="consent">
            <input type="checkbox" checked disabled readOnly />
            <span>
              <strong>{t.necessary.title}</strong>
              <br />
              {t.necessary.body}
            </span>
          </label>
          <label className="consent">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span>
              <strong>{t.analytics.title}</strong>
              <br />
              {t.analytics.body}
            </span>
          </label>
          <div className="row">
            <button className="btn btn--primary btn--small" type="button" onClick={() => decide(analytics)}>
              {t.save}
            </button>
          </div>
        </div>
      ) : (
        <div className="row cookies__actions">
          <button className="btn btn--primary btn--small" type="button" onClick={() => decide(true)}>
            {t.accept}
          </button>
          <button className="btn btn--secondary btn--small" type="button" onClick={() => decide(false)}>
            {t.refuse}
          </button>
          <button className="link-more" type="button" onClick={() => setDetail(true)}>
            {t.customize}
          </button>
        </div>
      )}
    </aside>
  )
}
