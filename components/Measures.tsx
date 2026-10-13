import type { Locale } from '@/lib/i18n'
import { Tbd } from './Tbd'

/**
 * Le bloc « Ce que vous mesurez », en grands chiffres.
 *
 * C'est lui qui porte la promesse de resultat, donc il montre l'avant et
 * l'apres de chaque indicateur. Les valeurs sont celles du client : tant
 * qu'un diagnostic ne les a pas etablies, les deux colonnes portent leur
 * emplacement, et la promesse reste une promesse de mesure, pas un chiffre
 * invente.
 */
export default function Measures({
  locale,
  measures,
  labels,
}: {
  locale: Locale
  measures: string[]
  labels: { before: string; after: string }
}) {
  return (
    <div className="grid grid--3">
      {measures.map((measure) => (
        <div className="card measure-card" key={measure}>
          <h3>{measure}</h3>
          <div className="measure-card__pair">
            <div>
              <div className="measure-card__label">{labels.before}</div>
              <div className="measure-card__value">
                <Tbd locale={locale} />
              </div>
            </div>
            <svg className="measure-card__arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path className="icon" d="M4 12h15" />
              <path className="icon" d="M13 6l6 6-6 6" />
            </svg>
            <div>
              <div className="measure-card__label">{labels.after}</div>
              <div className="measure-card__value">
                <Tbd locale={locale} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
