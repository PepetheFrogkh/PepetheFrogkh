import type { Locale } from '@/lib/i18n'
import { Tbd } from './Tbd'

/**
 * L'eventail de realisations : des captures sur ecrans, inclinees, comme chez
 * TechFlow.
 *
 * Les cartes alternent leur inclinaison et se chevauchent legerement ; au
 * survol, celle qu'on vise se redresse et passe devant. Sur mobile
 * l'inclinaison tombe et les captures defilent horizontalement, parce qu'un
 * eventail de cinq cartes n'a pas de place en 390 px.
 */
export default function Fan({
  locale,
  shots,
}: {
  locale: Locale
  shots: { name: string; shot: string | null }[]
}) {
  return (
    <div className="fan">
      {shots.map((item, i) => (
        <figure className="fan__card" key={item.name} data-tilt={i % 2 === 0 ? 'left' : 'right'}>
          {item.shot ? (
            <img src={item.shot} alt={item.name} loading="lazy" />
          ) : (
            <span className="fan__empty">
              <Tbd locale={locale} what={item.name} />
            </span>
          )}
        </figure>
      ))}
    </div>
  )
}
