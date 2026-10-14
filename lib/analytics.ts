import { readConsent } from './consent'

/**
 * Les evenements suivis, et seulement eux.
 *
 * Le cahier liste : clic et envoi du diagnostic, clic « Reserver un appel »,
 * configurateur commence, prix affiche. Rien n'est envoye sans consentement,
 * et aucune balise n'est chargee ici : `track` ne fait que deposer
 * l'evenement dans la couche de donnees, que l'outil de mesure lira une fois
 * qu'il sera branche.
 */
export type TrackedEvent =
  | 'diagnostic_click'
  | 'diagnostic_submit'
  | 'book_call_click'
  | 'configurator_start'
  | 'price_shown'
  | 'currency_change'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: TrackedEvent, props: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  if (!readConsent()?.analytics) return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...props })
}
