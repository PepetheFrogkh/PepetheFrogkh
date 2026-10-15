import { type CSSProperties, type ReactNode } from 'react'
import HeroRotate from './HeroRotate'
import HeroWave from './hero/HeroWave'
import { accent } from './accent'

/** Le nombre de caracteres de la ligne la plus longue, asterisques exclues. */
function longest(lines: string[]): number {
  return lines.reduce((max, line) => Math.max(max, line.replace(/\*/g, '').length), 1)
}

/**
 * L'en-tete, typographique.
 *
 * Le titre est le visuel, et il ne bouge plus : la seule animation est
 * l'apparition au chargement, ligne par ligne dans un masque. Le texte reste
 * a sa place, donc deux lignes ne peuvent pas se chevaucher, a aucun moment
 * du defilement.
 *
 * Derriere, une nappe de particules calculee par la carte graphique occupe la
 * bande basse du cadre. Elle est decorative, donc `aria-hidden` et sans texte,
 * et elle ne passe jamais derriere le bloc de texte : le titre ne depend pas
 * d'elle pour se lire, a aucun moment du defilement. Quand WebGL manque, que
 * la machine n'arrive pas a suivre, que le visiteur demande moins
 * d'animation ou qu'il economise ses donnees, une image fixe en CSS tient la
 * place. Voir `components/hero/HeroWave`.
 */
export default function HeroType({
  eyebrow,
  lines,
  rotate,
  children,
}: {
  eyebrow: string
  /** Le titre ligne par ligne ; la derniere est le mot qui tourne. */
  lines: string[]
  /**
   * Les propositions qui se relaient sur la derniere ligne.
   *
   * La premiere est celle du HTML : elle s'affiche avant tout JavaScript, et
   * elle reste seule en mouvement reduit.
   */
  rotate: string[]
  /** Le sous-titre, les boutons et la note. */
  children: ReactNode
}) {
  return (
    <section className="typo">
      <HeroWave />

      <div className="container typo__inner">
        {/* La taille du titre se calcule sur la ligne la plus longue, et non
            sur la seule largeur de la fenetre : « We build the tools » et
            « On construit » n'ont pas la meme longueur, et un titre qui ne se
            coupe pas doit tenir dans sa colonne dans les deux langues.
            Les propositions qui tournent comptent : la plus longue prend la
            place de la derniere ligne, et sans elle « des outils qui se
            parlent. » sortait de la colonne. */}
        <div
          className="typo__text"
          style={{ '--chars': longest([...lines, ...rotate]) } as CSSProperties}
        >
          <span className="eyebrow typo__eyebrow">{eyebrow}</span>

          <h1 className="typo__title">
            {lines.map((line, i) => (
              <span className="typo__line" key={line}>
                {/* le mot entre par un masque, du bas vers le haut : c'est le
                    cadre qui s'ouvre, le texte lui-meme est deja la */}
                <span className="typo__word" style={{ animationDelay: `${i * 90}ms` }}>
                  {/* La derniere ligne est celle qui tourne : « On construit »
                      reste, et ce qui suit change. Le premier mot est dans le
                      HTML, donc la ligne n'est jamais vide. */}
                  {i === lines.length - 1 ? (
                    <HeroRotate words={rotate} />
                  ) : (
                    accent(line, 'typo__accent')
                  )}
                </span>
              </span>
            ))}
          </h1>

          <div className="typo__foot">{children}</div>
        </div>
      </div>
    </section>
  )
}
