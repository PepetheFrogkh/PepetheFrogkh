import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/i18n'

/**
 * Statique, et pas par precaution : en export statique, une route sans cette
 * ligne fait echouer le build, et c'est tant mieux. Rien ici ne depend de la
 * requete : le contenu se calcule une fois, au build, depuis les tables de
 * `lib/i18n` et le contenu.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
