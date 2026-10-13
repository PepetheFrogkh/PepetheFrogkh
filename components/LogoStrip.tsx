import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import { Tbd } from './Tbd'

/**
 * Le bandeau de logos clients, en niveaux de gris, qui defile en boucle en 30
 * secondes.
 *
 * Le cahier le veut vide tant qu'aucun accord n'est donne : la liste est donc
 * vide et le bandeau affiche l'emplacement. Pour le remplir, ajouter les
 * fichiers dans `public/logos/` et les lister ici.
 */
const LOGOS: { src: string; alt: string }[] = []

export default function LogoStrip({ locale }: { locale: Locale }) {
  const t = dict(locale).proof

  return (
    <div>
      <div className="small muted" style={{ marginBottom: 'var(--s3)' }}>
        {t.logosTitle}
      </div>
      {LOGOS.length === 0 ? (
        <Tbd locale={locale} what="logos clients" />
      ) : (
        <div className="marquee">
          <div className="marquee__track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} height={28} loading="lazy" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
