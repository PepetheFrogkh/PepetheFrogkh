import { PAGES, path, type Locale, type PageKey } from './i18n'

/**
 * Le lien de reservation de 30 minutes.
 *
 * Le cahier le marque [À FOURNIR] : tant que la variable n'est pas posee,
 * chaque bouton « Reserver un appel » affiche l'emplacement au lieu d'un lien
 * mort.
 */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? ''


/**
 * Transforme un lien de `content/` en adresse reelle.
 *
 * Renvoie null quand la cible n'a pas ete fournie : le composant affiche
 * alors un emplacement visible plutot qu'un lien qui ne mene nulle part.
 */
export function resolve(locale: Locale, href: string): string | null {
  if (!href) return null
  if (href === 'booking') return BOOKING_URL || null
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return href

  // une page peut etre suivie d'une ancre : 'home#offres'
  const [route, hash] = href.split('#')
  const suffix = hash ? `#${hash}` : ''

  const [head, ...rest] = route.split('/')
  if ((PAGES as string[]).includes(head)) return path(locale, head as PageKey, ...rest) + suffix
  return href.startsWith('/') ? href : `/${locale}/${href}`
}
