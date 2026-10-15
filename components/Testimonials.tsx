import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import type { Testimonial } from '@/content'
import Reveal from './Reveal'
import SplitHeading from './SplitHeading'
import { Tbd } from './Tbd'

/**
 * Les temoignages.
 *
 * Le bloc vivait en double, mot pour mot, dans la page d'accueil et dans la
 * page Realisations. La signature y etait fausse de la meme facon aux deux
 * endroits : elle collait le nom et la societe avec une virgule sans regarder
 * si le nom existait, et un temoignage sans nom s'affichait « , MP Massage ».
 * Un client peut autoriser la citation sans autoriser son nom, c'est un cas
 * normal, et il se traite une fois.
 */

/** Le nom, le role et la societe, dans cet ordre, sans trou ni virgule seule. */
function signature(item: Testimonial): string {
  return [item.author, item.role, item.company].filter(Boolean).join(', ')
}

export default function Testimonials({ locale }: { locale: Locale }) {
  const t = dict(locale)

  return (
    <>
      <Reveal>
        <div className="section__head">
          <SplitHeading text={t.testimonials.title} />
          <p className="lead">{t.testimonials.note}</p>
        </div>
      </Reveal>
      <div className="grid grid--3">
        {t.testimonials.items.map((item, i) => (
          <Reveal key={i}>
            <div className="card">
              {item.text ? (
                <>
                  <p className="card__quote">« {item.text} »</p>
                  <p className="muted small" style={{ marginBottom: 0 }}>
                    {signature(item)}
                  </p>
                </>
              ) : (
                <Tbd locale={locale} what={t.words.testimonial} />
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </>
  )
}
