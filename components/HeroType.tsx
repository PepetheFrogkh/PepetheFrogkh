import { Fragment, type CSSProperties, type ReactNode } from 'react'
import HeroPanel from './HeroPanel'

/**
 * Le mot entre asterisques passe en italique orange terre.
 *
 * La convention vaut pour une partie de ligne et pas seulement pour une ligne
 * entiere : « qui font *tourner* » met un seul mot en valeur, au milieu de sa
 * ligne.
 */
/** Le nombre de caracteres de la ligne la plus longue, asterisques exclues. */
function longest(lines: string[]): number {
  return lines.reduce((max, line) => Math.max(max, line.replace(/\*/g, '').length), 1)
}

function accent(line: string): ReactNode[] {
  return line.split('*').map((part, i) =>
    i % 2 === 1 ? (
      <em className="typo__accent" key={i}>
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

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
        {/* La taille du titre se calcule sur la ligne la plus longue, et non
            sur la seule largeur de la fenetre : « We build the tools » et
            « On construit » n'ont pas la meme longueur, et un titre qui ne se
            coupe pas doit tenir dans sa colonne dans les deux langues. */}
        <div className="typo__text" style={{ '--chars': longest(lines) } as CSSProperties}>
          <span className="eyebrow typo__eyebrow">{eyebrow}</span>

          <h1 className="typo__title">
            {lines.map((line, i) => (
              <span className="typo__line" key={line}>
                {/* le mot entre par un masque, du bas vers le haut : c'est le
                    cadre qui s'ouvre, le texte lui-meme est deja la */}
                <span className="typo__word" style={{ animationDelay: `${i * 90}ms` }}>
                  {accent(line)}
                </span>
              </span>
            ))}
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
