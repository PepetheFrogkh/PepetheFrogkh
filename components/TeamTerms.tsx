import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import Reveal from './Reveal'
import SplitHeading from './SplitHeading'

/**
 * Ce qu'engage une equipe dediee, et les deux facons de l'acheter.
 *
 * Deux blocs qui ne sont pas des prix, et qui pesent pourtant plus lourd que
 * la grille : l'engagement minimum, l'UI/UX compris, et surtout la difference
 * entre acheter a l'heure et acheter au resultat. C'est la question qui
 * revient a chaque projet, et la reponse n'est pas la meme selon que la date
 * est tenue ou que le budget est compte.
 *
 * Les deux colonnes sont cote a cote et de meme poids : aucune des deux n'est
 * le bon choix dans l'absolu, et la page ne doit pas en pousser une.
 */
export default function TeamTerms({ locale }: { locale: Locale }) {
  const t = dict(locale).pricing.profiles

  return (
    <>
      <Reveal>
        <div className="section__head terms__head">
          <SplitHeading text={t.terms.title} />
        </div>
      </Reveal>
      <ul className="offers terms__list">
        {t.terms.items.map((line, i) => (
          <Reveal key={line} delay={i * 50}>
            <li className="offer">
              <svg
                className="offer__tick"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m4 10.5 4 4 8-9" />
              </svg>
              <span>{line}</span>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal>
        <div className="section__head terms__head">
          <SplitHeading text={t.billing.title} />
          <p className="lead">{t.billing.lead}</p>
        </div>
      </Reveal>
      <div className="ways">
        {[t.billing.hourly, t.billing.fixed].map((way, i) => (
          <Reveal key={way.name} delay={i * 80}>
            <div className="way">
              <h3 className="way__name">{way.name}</h3>
              <ul className="way__list">
                {way.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  )
}
