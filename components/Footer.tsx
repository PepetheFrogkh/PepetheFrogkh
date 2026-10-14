import Link from 'next/link'
import { dict } from '@/content'
import {
  EXPERTISES,
  SERVICES,
  expertisePath,
  path,
  servicePath,
  type Locale,
} from '@/lib/i18n'
import { resolve } from '@/lib/links'

/**
 * Le pied de page : quatre colonnes, puis la ligne legale.
 *
 * Les colonnes Services et Expertises sont construites a partir de la table des
 * adresses, pas recopiees dans le contenu : leurs noms sont deja dans `map`,
 * et une liste recopiee finit toujours par diverger de l'autre. Les deux
 * dernieres colonnes, elles, sont un choix editorial et vivent dans le
 * contenu.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const t = dict(locale)

  const generated = [
    {
      title: t.map.services.title,
      links: SERVICES.map((key) => ({
        label: t.map.services.children[key],
        href: servicePath(locale, key),
      })),
    },
    {
      title: t.map.expertises.title,
      links: EXPERTISES.map((key) => ({
        label: t.map.expertises.children[key],
        href: expertisePath(locale, key),
      })),
    },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          {generated.map((col) => (
            <div key={col.title}>
              <div className="footer__title">{col.title}</div>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
          <Link className="footer__home" href={path(locale, 'home')}>
            {t.footer.legal}
          </Link>
          <span>{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
