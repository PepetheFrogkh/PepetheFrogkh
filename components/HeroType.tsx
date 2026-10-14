import type { ReactNode } from 'react'
import HeroPanel from './HeroPanel'

/**
 * L'en-tete, typographique.
 *
 * Le titre est le visuel, et il ne bouge plus : la seule animation est
 * l'apparition au chargement, ligne par ligne dans un masque. Le texte reste
 * a sa place, donc deux lignes ne peuvent pas se chevaucher, a aucun moment
 * du defilement.
 *
 * Sur grand ecran la composition tient en deux colonnes : le texte a gauche,
 * du premier mot jusqu'aux deux boutons, et a droite une composition de
 * cartes qui occupe la moitie restante. Cette composition est decorative, donc
 * `aria-hidden` et sans texte : elle ne porte aucune information, aucun chiffre
 * et aucun nom. Sous 1 200 px elle disparait, pour que l'etiquette, le titre,
 * le sous-titre et les deux boutons gardent le premier ecran pour eux.
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
        <div className="typo__text">
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

        <div className="typo__visual">
          <HeroPanel />
        </div>
      </div>
    </section>
  )
}
