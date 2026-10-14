import type { MetadataRoute } from 'next'
import { dict } from '@/content'
import {
  EXPERTISES,
  PAGES,
  PUBLISHED_LOCALES,
  SERVICES,
  SITE_URL,
  expertisePath,
  path,
  servicePath,
} from '@/lib/i18n'
import { visibleCases } from '@/lib/flags'
import { articles } from '@/lib/blog'

/**
 * Le sitemap.xml, une entree par langue publiee.
 *
 * Le khmer n'y entre qu'une fois sa traduction livree : annoncer aux moteurs
 * une page khmere qui sert du texte anglais la ferait traiter en doublon de la
 * page anglaise, au detriment des deux.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const urls: MetadataRoute.Sitemap = []

  for (const locale of PUBLISHED_LOCALES) {
    const t = dict(locale)

    for (const page of PAGES) {
      urls.push({
        url: SITE_URL + path(locale, page),
        lastModified: now,
        priority: page === 'home' ? 1 : 0.7,
      })
    }

    for (const key of SERVICES) {
      urls.push({ url: SITE_URL + servicePath(locale, key), lastModified: now, priority: 0.8 })
    }

    for (const key of EXPERTISES) {
      urls.push({ url: SITE_URL + expertisePath(locale, key), lastModified: now, priority: 0.8 })
    }

    for (const study of visibleCases(t.work.cases)) {
      urls.push({ url: SITE_URL + path(locale, 'work', study.slug), lastModified: now })
    }

    // les articles publies ; les brouillons n'y sont pas, par construction
    for (const article of await articles(locale)) {
      urls.push({
        url: SITE_URL + path(locale, 'blog', article.slug),
        lastModified: article.date ? new Date(article.date) : now,
      })
    }
  }

  return urls
}
