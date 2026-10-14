/**
 * Les trois langues du site, et la table des adresses.
 *
 * Francais si le navigateur est en francais, khmer s'il est en khmer, anglais
 * sinon. Le selecteur les donne toutes les trois, et les balises hreflang
 * suivent, avec x-default vers l'anglais. Une seule table decrit les adresses,
 * pour que le selecteur et les hreflang ne puissent pas diverger.
 */

export const LOCALES = ['fr', 'en', 'km'] as const
export type Locale = (typeof LOCALES)[number]

/** x-default pointe vers l'anglais, comme demande dans le cahier. */
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/**
 * Le nom de chaque langue, ecrit dans cette langue.
 *
 * Un selecteur qui dit « Khmer » a un lecteur khmer lui parle dans une langue
 * qu'il ne cherche pas. Le code court sert a l'affichage compact de l'en-tete.
 */
export const LOCALE_NAMES: Record<Locale, { name: string; short: string }> = {
  fr: { name: 'Français', short: 'FR' },
  en: { name: 'English', short: 'EN' },
  km: { name: 'ភាសាខ្មែរ', short: 'KH' },
}

/** L'etiquette Open Graph de chaque langue. */
export const OG_LOCALE: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_GB',
  km: 'km_KH',
}

/**
 * La traduction khmere, fournie ou non.
 *
 * Tant qu'elle vaut `false`, les pages en khmer servent le texte anglais avec
 * un bandeau qui le dit, et elles sortent du sitemap, des balises hreflang et
 * de l'index des moteurs. Servir de l'anglais sous une etiquette khmere sans
 * le dire serait du contenu duplique annonce comme une traduction.
 *
 * Quand `content/km.ts` sera rempli, passer a `true` suffit.
 */
export const KM_TRANSLATED = false

/** Les langues reellement publiees : le khmer n'y entre qu'une fois traduit. */
export const PUBLISHED_LOCALES: Locale[] = LOCALES.filter(
  (l) => l !== 'km' || KM_TRANSLATED,
)

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
/**
 * Les segments khmers reprennent les segments anglais, en caracteres latins.
 *
 * Un segment ecrit en khmer sort de la barre d'adresse en pourcentages, et un
 * lien partage devient illisible. Le prefixe `/km` suffit a dire la langue.
 */
const SEGMENTS: Record<PageKey, Record<Locale, string>> = {
  home: { fr: '', en: '', km: '' },
  services: { fr: 'services', en: 'services', km: 'services' },
  expertises: { fr: 'expertises', en: 'expertise', km: 'expertise' },
  work: { fr: 'realisations', en: 'work', km: 'work' },
  pricing: { fr: 'tarifs', en: 'pricing', km: 'pricing' },
  blog: { fr: 'blog', en: 'blog', km: 'blog' },
  about: { fr: 'a-propos', en: 'about', km: 'about' },
  contact: { fr: 'contact', en: 'contact', km: 'contact' },
  legal: { fr: 'mentions-legales', en: 'legal-notice', km: 'legal-notice' },
  privacy: { fr: 'confidentialite', en: 'privacy', km: 'privacy' },
}

/**
 * Les six services, et les sept expertises.
 *
 * Leurs adresses enfants sont declarees ici, langue par langue, et non
 * deduites d'une position dans une liste de contenu : une page de service
 * doit pouvoir changer de place dans un menu sans changer d'adresse.
 */
export const SERVICES = [
  'sites',
  'automations',
  'custom',
  'apps',
  'consulting',
  'feedback',
] as const
export type ServiceKey = (typeof SERVICES)[number]

const SERVICE_SLUGS: Record<ServiceKey, Record<Locale, string>> = {
  sites: { fr: 'sites-web', en: 'websites', km: 'websites' },
  automations: { fr: 'automatisations', en: 'automations', km: 'automations' },
  custom: { fr: 'projets-sur-mesure', en: 'custom-projects', km: 'custom-projects' },
  apps: { fr: 'applications-metier', en: 'business-apps', km: 'business-apps' },
  consulting: { fr: 'accompagnement', en: 'consulting', km: 'consulting' },
  feedback: { fr: 'ecoute-client', en: 'guest-feedback', km: 'guest-feedback' },
}

export const EXPERTISES = [
  'restaurants',
  'retail',
  'hotels',
  'manufacturing',
  'teams',
  'crm',
  'insurance',
] as const
export type ExpertiseKey = (typeof EXPERTISES)[number]

const EXPERTISE_SLUGS: Record<ExpertiseKey, Record<Locale, string>> = {
  restaurants: { fr: 'restauration', en: 'restaurants', km: 'restaurants' },
  retail: { fr: 'commerce-de-detail', en: 'retail', km: 'retail' },
  hotels: { fr: 'hotellerie', en: 'hotels', km: 'hotels' },
  manufacturing: { fr: 'production-et-manufacturing', en: 'manufacturing', km: 'manufacturing' },
  teams: { fr: 'gestion-des-equipes', en: 'team-management', km: 'team-management' },
  crm: { fr: 'crm', en: 'crm', km: 'crm' },
  insurance: {
    fr: 'assurance-et-courtage',
    en: 'insurance-and-brokerage',
    km: 'insurance-and-brokerage',
  },
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

/** Les autres langues, dans l'ordre du selecteur. */
export function others(locale: Locale): Locale[] {
  return LOCALES.filter((l) => l !== locale)
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
