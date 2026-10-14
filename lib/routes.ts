import { dict } from '@/content'
import {
  DEFAULT_LOCALE,
  LOCALES,
  PUBLISHED_LOCALES,
  SITE_URL,
  expertiseOf,
  expertisePath,
  isLocale,
  pageOf,
  path,
  serviceOf,
  servicePath,
  type Locale,
} from './i18n'

/**
 * La traduction d'une adresse, slug compris.
 *
 * Les slugs enfants ne sont pas les memes dans les deux langues :
 * /fr/services/sites-web est /en/services/websites. Le selecteur de langue et
 * les balises hreflang passent tous les deux par ici, sinon l'un des deux
 * finit par pointer vers une page qui n'existe pas.
 *
 * Les services et les expertises ont leurs slugs declares dans la table de
 * `lib/i18n` : la traduction est exacte. Les realisations et les articles sont
 * du contenu, et leur correspondance se fait par position dans la liste, les
 * deux langues decrivant les memes elements dans le meme ordre.
 */
export function translatePath(from: Locale, to: Locale, pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0 || !isLocale(parts[0])) return path(to, 'home')

  const [, head, child] = parts
  if (!head) return path(to, 'home')

  const key = pageOf(from, head)
  if (!key) return path(to, 'home')
  if (!child) return path(to, key)

  if (key === 'services') {
    const service = serviceOf(from, child)
    return service ? servicePath(to, service) : path(to, key)
  }

  if (key === 'expertises') {
    const expertise = expertiseOf(from, child)
    return expertise ? expertisePath(to, expertise) : path(to, key)
  }

  if (key === 'work') {
    const i = dict(from).work.cases.findIndex((c) => c.slug === child)
    const target = i >= 0 ? dict(to).work.cases[i] : undefined
    return target ? path(to, key, target.slug) : path(to, key)
  }

  return path(to, key)
}

/**
 * Les balises hreflang d'une page : une par langue publiee, plus x-default.
 *
 * Une langue dont la traduction n'est pas fournie n'y figure pas : annoncer
 * une page khmere qui sert du texte anglais serait annoncer une traduction qui
 * n'existe pas, et les moteurs la traitent alors comme un doublon de la page
 * anglaise. `PUBLISHED_LOCALES` decide, et il suffit de livrer la traduction
 * pour que la balise apparaisse.
 */
export function alternates(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const from: Locale = parts.length && isLocale(parts[0]) ? parts[0] : DEFAULT_LOCALE
  const here = '/' + parts.join('/')

  const languages: Record<string, string> = {}
  for (const to of PUBLISHED_LOCALES) {
    languages[to] = SITE_URL + (to === from ? here : translatePath(from, to, here))
  }
  languages['x-default'] =
    languages[DEFAULT_LOCALE] ?? SITE_URL + translatePath(from, DEFAULT_LOCALE, here)

  return { canonical: SITE_URL + here, languages }
}

/** Cette page, dans chacune des autres langues : le menu du selecteur. */
export function allPaths(from: Locale, pathname: string): Record<Locale, string> {
  const out = {} as Record<Locale, string>
  for (const to of LOCALES) {
    out[to] = to === from ? pathname : translatePath(from, to, pathname)
  }
  return out
}
