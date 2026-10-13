import Link from 'next/link'
import { dict } from '@/content'
import { path, type Locale } from '@/lib/i18n'
import { Tbd } from './Tbd'

/**
 * Les cartes de situation, en accordeon.
 *
 * Elles sont repliees au repos et s'elargissent au survol sur ordinateur, et
 * simplement empilees sur mobile. L'elargissement est en CSS, par flex-grow,
 * donc il repond aussi au focus clavier et il disparait quand le visiteur
 * reduit les animations.
 */
export default function SituationList({ locale }: { locale: Locale }) {
  const t = dict(locale).situations
  const cards = t.cards.filter((c) => c.published)

  return (
    <div className="situations__list">
      {cards.map((card) => (
        <article className="situations__item" key={card.slug}>
          <div className="card__num">{card.index}</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{card.title}</h3>
          <div className="situations__body">
            <p className="card__quote">
              {card.quote.startsWith('[') ? <Tbd locale={locale} what="phrase du client" /> : card.quote}
            </p>
            <div className="row" style={{ gap: 8 }}>
              {card.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link className="link-more" href={path(locale, 'situations', card.slug)}>
              {t.more}
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
