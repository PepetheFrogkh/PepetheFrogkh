import Link from 'next/link'
import { dict } from '@/content'
import { path, type Locale } from '@/lib/i18n'
import { resolve } from '@/lib/links'
import { Tbd } from './Tbd'

/**
 * Les cartes de situation, en accordeon, avec une photo plein cadre.
 *
 * Elles sont repliees au repos et s'elargissent au survol sur ordinateur, et
 * simplement empilees sur mobile. L'elargissement passe par flex-grow en CSS,
 * donc il repond aussi au focus clavier et disparait quand le visiteur reduit
 * les animations.
 *
 * Repliee, la carte reste lisible : la citation est ramenee a trois lignes,
 * jamais cachee. Les etiquettes et le lien restent la, parce qu'une section
 * entiere de cartes vides ne dit rien au visiteur qui passe.
 *
 * La carte 05 ne mene pas a une page situation : le cahier la renvoie vers
 * l'offre Sites, et son champ `link` le dit.
 */
export default function SituationList({ locale }: { locale: Locale }) {
  const t = dict(locale).situations
  const cards = t.cards.filter((c) => c.published)

  return (
    <div className="situations__list">
      {cards.map((card) => {
        const href = card.link ? resolve(locale, card.link) : path(locale, 'expertises', card.slug)
        return (
          <article className="situations__item" key={card.slug}>
            <div className="situations__photo" aria-hidden={card.photo ? undefined : true}>
              {card.photo ? (
                <img src={card.photo} alt={card.title} loading="lazy" />
              ) : (
                <span className="situations__photo-empty">
                  <Tbd locale={locale} what={locale === 'fr' ? 'photo' : 'photo'} />
                </span>
              )}
            </div>
            <div className="situations__inner">
              <div className="card__num">{card.index}</div>
              <h3>{card.title}</h3>
              <div className="situations__body">
                <p className="card__quote situations__quote">
                  {card.quote.startsWith('[') ? <Tbd locale={locale} /> : `« ${card.quote} »`}
                </p>
                <div className="row" style={{ gap: 8 }}>
                  {card.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                {href ? (
                  <Link className="link-more" href={href}>
                    {t.more}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
