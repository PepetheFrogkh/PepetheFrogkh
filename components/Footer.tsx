import Link from 'next/link'
import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { resolve } from '@/lib/links'

/** Quatre colonnes, puis la ligne legale. Fond creme. */
export default function Footer({ locale }: { locale: Locale }) {
  const t = dict(locale)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          {t.footer.columns.map((col) => (
            <div key={col.title}>
              <div className="footer__title">{col.title}</div>
              <ul>
                {col.links.map((link) => {
                  const href = resolve(locale, link.href)
                  return (
                    <li key={link.label}>
                      {href ? (
                        href.startsWith('mailto:') ? (
                          <a href={href}>{link.label}</a>
                        ) : (
                          <Link href={href}>{link.label}</Link>
                        )
                      ) : (
                        <span>{link.label}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer__legal">
          <span>{t.footer.legal}</span>
          <span>{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
