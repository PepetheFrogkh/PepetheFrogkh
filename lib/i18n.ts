/**
 * Les deux langues du site, et la table des adresses.
 *
 * Le cahier impose : francais si le navigateur est en francais, anglais sinon,
 * un selecteur FR / EN toujours visible, et des balises hreflang fr, en et
 * x-default vers l'anglais. Une seule table decrit les adresses des deux
 * langues, pour que le selecteur et les hreflang ne puissent pas divergher.
 */

export const LOCALES = ['fr', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** x-default pointe vers l'anglais, comme demande dans le cahier. */
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Les pages du site, hors pages generees a partir d'une liste. */
export type PageKey =
  | 'home'
  | 'situations'
  | 'work'
  | 'method'
  | 'about'
  | 'diagnostic'
  | 'legal'
  | 'privacy'

/**
 * Le segment d'adresse de chaque page, par langue.
 *
 * Le plan du site vit dans l'onglet principal, que ce depot n'a pas : ces
 * segments sont a relire avec Arnaud avant la mise en ligne. Les changer ici
 * suffit, rien d'autre ne code une adresse en dur.
 */
const SEGMENTS: Record<PageKey, Record<Locale, string>> = {
  home: { fr: '', en: '' },
  situations: { fr: 'situations', en: 'situations' },
  work: { fr: 'realisations', en: 'work' },
  method: { fr: 'methode', en: 'method' },
  about: { fr: 'a-propos', en: 'about' },
  diagnostic: { fr: 'diagnostic', en: 'diagnostic' },
  legal: { fr: 'mentions-legales', en: 'legal-notice' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
}

/** L'adresse d'une page, avec son prefixe de langue. */
export function path(locale: Locale, page: PageKey, ...rest: string[]): string {
  const parts = [locale, SEGMENTS[page][locale], ...rest].filter(Boolean)
  return '/' + parts.join('/')
}

export function segment(locale: Locale, page: PageKey): string {
  return SEGMENTS[page][locale]
}

/** L'autre langue, pour le selecteur. */
export function other(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr'
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://kuiperstudio.com'

/** Toutes les pages, pour les boucles de generation et de resolution. */
export const PAGES: PageKey[] = [
  'home',
  'situations',
  'work',
  'method',
  'about',
  'diagnostic',
  'legal',
  'privacy',
]

/** La cle de page qui porte ce segment, dans cette langue. */
export function pageOf(locale: Locale, head: string): PageKey | null {
  return PAGES.find((key) => SEGMENTS[key][locale] === head) ?? null
}
