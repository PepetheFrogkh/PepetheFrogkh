/**
 * Le consentement aux cookies.
 *
 * Le cahier est net : aucun traceur avant consentement. Rien n'est donc
 * charge ni declenche tant que `analytics` n'est pas vrai, et l'absence de
 * choix vaut refus.
 */
export const CONSENT_KEY = 'kuiper-consent'
export const CONSENT_EVENT = 'kuiper-consent-change'

export interface Consent {
  necessary: true
  analytics: boolean
  at: string
}

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Consent>
    return { necessary: true, analytics: parsed.analytics === true, at: parsed.at ?? '' }
  } catch {
    // un stockage bloque vaut absence de choix, donc refus
    return null
  }
}

export function writeConsent(analytics: boolean): Consent {
  const consent: Consent = { necessary: true, analytics, at: new Date().toISOString() }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  } catch {
    // tant pis : le bandeau reviendra, aucun traceur n'aura ete pose
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }))
  return consent
}
