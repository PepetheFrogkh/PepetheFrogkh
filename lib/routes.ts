import { dict } from '@/content'
import {
  DEFAULT_LOCALE,
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
export function translatePath(from: Locale, pathname: string): string {
  const to = other(from)
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

/** Les balises hreflang d'une page : fr, en, et x-default vers l'anglais. */
export function alternates(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const from: Locale = parts.length && isLocale(parts[0]) ? parts[0] : DEFAULT_LOCALE
  const here = '/' + parts.join('/')
  const there = translatePath(from, here)
  const fr = from === 'fr' ? here : there
  const en = from === 'en' ? here : there

  return {
    canonical: SITE_URL + here,
    languages: {
      fr: SITE_URL + fr,
      en: SITE_URL + en,
      'x-default': SITE_URL + (DEFAULT_LOCALE === 'en' ? en : fr),
    },
  }
}

function other(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr'
}
