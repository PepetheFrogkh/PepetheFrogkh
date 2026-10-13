import type { MetadataRoute } from 'next'
import { dict } from '@/content'
import { LOCALES, SITE_URL, path, type PageKey } from '@/lib/i18n'

/** Le sitemap.xml, les deux langues comprises. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const urls: MetadataRoute.Sitemap = []
  const simple: PageKey[] = [
    'home',
    'situations',
    'work',
    'method',
    'about',
    'diagnostic',
    'legal',
    'privacy',
  ]

  for (const locale of LOCALES) {
    const t = dict(locale)
    for (const page of simple) {
      urls.push({
        url: SITE_URL + path(locale, page),
        lastModified: now,
        priority: page === 'home' ? 1 : 0.7,
      })
    }
    for (const page of t.situationPages) {
      urls.push({ url: SITE_URL + path(locale, 'situations', page.slug), lastModified: now })
    }
    for (const study of t.work.cases) {
      urls.push({ url: SITE_URL + path(locale, 'work', study.slug), lastModified: now })
    }
  }

  return urls
}
