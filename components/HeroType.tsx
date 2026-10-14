import type { ReactNode } from 'react'

/**
 * L'en-tete, typographique.
 *
 * Pas de visuel anime sur le titre : le titre est le visuel. Tout est lisible
 * des l'arrivee, et le defilement ne touche plus a la composition. La seule
 * animation est l'apparition au chargement : chaque ligne glisse du bas vers
 * le haut dans son propre masque, avec un leger decalage d'une ligne a
 * l'autre. Le texte reste a sa place, donc deux lignes ne peuvent pas se
 * chevaucher, a aucun moment du defilement.
 */
export default function HeroType({
  eyebrow,
  lines,
  children,
}: {
  eyebrow: string
  /** Le titre ligne par ligne ; la derniere porte les asterisques. */
  lines: string[]
  /** Le sous-titre, les boutons et la note. */
  children: ReactNode
}) {
  return (
    <section className="typo">
      <div className="container typo__inner">
        <span className="eyebrow typo__eyebrow">{eyebrow}</span>

        <h1 className="typo__title">
          {lines.map((line, i) => {
            const accent = line.startsWith('*') && line.endsWith('*')
            const body = accent ? line.slice(1, -1) : line
            return (
              <span
                className={['typo__line', accent ? 'typo__line--accent' : '']
                  .filter(Boolean)
                  .join(' ')}
                key={line}
              >
                {/* le mot entre par un masque, du bas vers le haut : c'est le
                    cadre qui s'ouvre, le texte lui-meme est deja la */}
                <span className="typo__word" style={{ animationDelay: `${i * 90}ms` }}>
                  {body}
                </span>
              </span>
            )
          })}
        </h1>

        <div className="typo__foot">{children}</div>
      </div>
    </section>
  )
}
