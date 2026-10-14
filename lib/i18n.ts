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
  | 'services'
  | 'expertises'
  | 'work'
  | 'pricing'
  | 'blog'
  | 'about'
  | 'contact'
  | 'legal'
  | 'privacy'

/**
 * Le segment d'adresse de chaque page, par langue.
 *
 * Changer un segment ici suffit : rien d'autre ne code une adresse en dur, ni
 * la navigation, ni le selecteur de langue, ni les balises hreflang, ni le
 * sitemap.
 */
const SEGMENTS: Record<PageKey, Record<Locale, string>> = {
  home: { fr: '', en: '' },
  services: { fr: 'services', en: 'services' },
  expertises: { fr: 'expertises', en: 'expertise' },
  work: { fr: 'realisations', en: 'work' },
  pricing: { fr: 'tarifs', en: 'pricing' },
  blog: { fr: 'blog', en: 'blog' },
  about: { fr: 'a-propos', en: 'about' },
  contact: { fr: 'contact', en: 'contact' },
  legal: { fr: 'mentions-legales', en: 'legal-notice' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
}

/**
 * Les cinq services, et les six expertises.
 *
 * Leurs adresses enfants sont declarees ici, langue par langue, et non
 * deduites d'une position dans une liste de contenu : une page de service
 * doit pouvoir changer de place dans un menu sans changer d'adresse.
 */
export const SERVICES = ['sites', 'automations', 'custom', 'apps', 'feedback'] as const
export type ServiceKey = (typeof SERVICES)[number]

const SERVICE_SLUGS: Record<ServiceKey, Record<Locale, string>> = {
  sites: { fr: 'sites-web', en: 'websites' },
  automations: { fr: 'automatisations', en: 'automations' },
  custom: { fr: 'projets-sur-mesure', en: 'custom-projects' },
  apps: { fr: 'applications-metier', en: 'business-apps' },
  feedback: { fr: 'ecoute-client', en: 'guest-feedback' },
}

export const EXPERTISES = [
  'restaurants',
  'hotels',
  'manufacturing',
  'teams',
  'crm',
  'insurance',
] as const
export type ExpertiseKey = (typeof EXPERTISES)[number]

const EXPERTISE_SLUGS: Record<ExpertiseKey, Record<Locale, string>> = {
  restaurants: { fr: 'restauration', en: 'restaurants' },
  hotels: { fr: 'hotellerie', en: 'hotels' },
  manufacturing: { fr: 'production-et-manufacturing', en: 'manufacturing' },
  teams: { fr: 'gestion-des-equipes', en: 'team-management' },
  crm: { fr: 'crm', en: 'crm' },
  insurance: { fr: 'assurance-et-courtage', en: 'insurance-and-brokerage' },
}

/** L'adresse d'une page de service. */
export function servicePath(locale: Locale, key: ServiceKey): string {
  return path(locale, 'services', SERVICE_SLUGS[key][locale])
}

/** L'adresse d'une page d'expertise. */
export function expertisePath(locale: Locale, key: ExpertiseKey): string {
  return path(locale, 'expertises', EXPERTISE_SLUGS[key][locale])
}

export function serviceSlug(locale: Locale, key: ServiceKey): string {
  return SERVICE_SLUGS[key][locale]
}

export function expertiseSlug(locale: Locale, key: ExpertiseKey): string {
  return EXPERTISE_SLUGS[key][locale]
}

/** Le service que porte ce segment, dans cette langue. */
export function serviceOf(locale: Locale, slug: string): ServiceKey | null {
  return SERVICES.find((key) => SERVICE_SLUGS[key][locale] === slug) ?? null
}

/** L'expertise que porte ce segment, dans cette langue. */
export function expertiseOf(locale: Locale, slug: string): ExpertiseKey | null {
  return EXPERTISES.find((key) => EXPERTISE_SLUGS[key][locale] === slug) ?? null
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
  'services',
  'expertises',
  'work',
  'pricing',
  'blog',
  'about',
  'contact',
  'legal',
  'privacy',
]

/** La cle de page qui porte ce segment, dans cette langue. */
export function pageOf(locale: Locale, head: string): PageKey | null {
  return PAGES.find((key) => SEGMENTS[key][locale] === head) ?? null
}
