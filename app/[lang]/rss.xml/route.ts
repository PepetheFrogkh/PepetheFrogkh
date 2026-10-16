import { articles } from '@/lib/blog'
import { dict } from '@/content'
import { LOCALES, SITE_URL, isLocale } from '@/lib/i18n'

/**
 * Statique, et pas par precaution : en export statique, une route sans cette
 * ligne fait echouer le build, et c'est tant mieux. Rien ici ne depend de la
 * requete : le contenu se calcule une fois, au build, depuis les tables de
 * `lib/i18n` et le contenu.
 */
export const dynamic = 'force-static'

/**
 * Le flux RSS du blog, une adresse par langue.
 *
 * `/fr/rss.xml` et `/en/rss.xml`. Le middleware laisse passer les adresses qui
 * portent un point, donc ces deux la ne sont pas redirigees.
 *
 * Le flux n'est pas sous /blog : un dossier `blog` dans l'arborescence des
 * routes masquerait la page /fr/blog, qui est resolue par le segment
 * attrape-tout. Mesure a l'ecran : elle repondait 404.
 */

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

function escape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET(_request: Request, context: { params: Promise<unknown> }) {
  const { lang } = (await context.params) as { lang: string }
  if (!isLocale(lang)) return new Response('Not found', { status: 404 })

  const t = dict(lang)
  const list = await articles(lang)
  const home = `${SITE_URL}/${lang}/blog`

  const items = list
    .map((article) => {
      const url = `${SITE_URL}/${lang}/blog/${article.slug}`
      return [
        '    <item>',
        `      <title>${escape(article.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escape(article.summary)}</description>`,
        article.date ? `      <pubDate>${new Date(article.date).toUTCString()}</pubDate>` : '',
        ...article.tags.map((tag) => `      <category>${escape(tag)}</category>`),
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escape(t.meta.blog.title)}</title>`,
    `    <link>${home}</link>`,
    `    <description>${escape(t.blog.lead)}</description>`,
    `    <language>${lang}</language>`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
