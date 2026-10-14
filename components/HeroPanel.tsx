/** Les barres d'une carte : une entete, puis des lignes de corps. */
const CARD_BARS = [
  [62, 100, 74, 100, 48],
  [54, 100, 86, 100],
  [70, 100, 60, 100, 82],
]

/**
 * Trois cartes posees en escalier, et rien d'autre.
 *
 * Aucune etiquette, aucun chiffre, aucun nom : la composition est decorative,
 * donc elle ne porte aucune information et le lecteur d'ecran l'ignore. Elle
 * sert a deux endroits : la moitie droite de l'en-tete d'accueil, et l'image
 * fixe de l'en-tete « le tableur qui se range » quand WebGL manque ou que la
 * machine n'arrive pas a suivre.
 */
export default function HeroPanel({ className }: { className?: string }) {
  return (
    <div className={['panel', className].filter(Boolean).join(' ')} aria-hidden="true">
      {CARD_BARS.map((bars, i) => (
        <div className={`panel__card panel__card--${i + 1}`} key={i}>
          <span className="panel__head" />
          <span className="panel__bars">
            {bars.map((w, j) => (
              <span
                className={`panel__bar${j % 2 ? ' panel__bar--faint' : ''}`}
                style={{ width: `${w}%` }}
                key={j}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}
