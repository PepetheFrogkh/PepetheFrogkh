/**
 * La vague de particules : ses constantes et sa grille.
 *
 * Le deplacement de chaque point est calcule par la carte graphique, dans le
 * nuanceur de sommets. Le processeur ne fait que passer quatre nombres par
 * image : le temps, l'amplitude, et les ondes du curseur. C'est ce qui permet
 * de tenir 34 000 points sans que la page ne bronche.
 */

/**
 * Le cote de la grille. 148 x 148 = 21 904 points, 116 x 116 = 13 456.
 *
 * Il valait 184 et 142, soit 33 856 points sur un bureau. Un point fait au
 * plus quatre pixels de cote : en enlever un tiers ne se voit pas, et le
 * nuanceur de sommets tourne un tiers de fois en moins par image, boucle sur
 * les ondes du curseur comprise. C'est la, et dans le masque passe du CSS au
 * nuanceur, que se jouait la saccade.
 */
export const DESKTOP_SIDE = 148
export const MOBILE_SIDE = 116

export const DESKTOP_COUNT = DESKTOP_SIDE * DESKTOP_SIDE
export const MOBILE_COUNT = MOBILE_SIDE * MOBILE_SIDE

/** L'etendue de la nappe, en unites de scene. */
export const SPAN = 17

/** Le nombre d'ondes du curseur qui vivent en meme temps. */
export const RIPPLES = 4

export const CAMERA = {
  fov: 38,
  /**
   * La camera descend et se rapproche de la nappe au defilement.
   *
   * Elle vise au-dessus de la nappe et non dessus : l'horizon tombe alors dans
   * le bas du cadre et le haut reste au texte. Viser la nappe la faisait
   * monter jusque sous le sous-titre.
   */
  from: { y: 2.75, z: 7.6, look: 1.55 },
  to: { y: 1.35, z: 6.4, look: 0.75 },
}

/** L'amplitude de la houle, du haut de page a la fin de la section. */
export const AMPLITUDE = { from: 0.52, to: 1.55 }

/**
 * La grille de points, dans le plan horizontal.
 *
 * Les points sont poses en quinconce d'une rangee a l'autre, avec un tres
 * leger desordre : une grille parfaitement reguliere fait apparaitre des
 * moires a l'ecran des qu'elle bouge.
 */
export function buildGrid(side: number): Float32Array {
  const positions = new Float32Array(side * side * 3)
  const step = SPAN / (side - 1)
  // un generateur reproductible : la nappe ne doit pas sauter au rechargement
  let seed = 9
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  let i = 0
  for (let row = 0; row < side; row++) {
    for (let col = 0; col < side; col++) {
      const stagger = row % 2 === 0 ? 0 : step * 0.5
      positions[i++] = -SPAN / 2 + col * step + stagger + (random() - 0.5) * step * 0.35
      positions[i++] = 0
      positions[i++] = -SPAN / 2 + row * step + (random() - 0.5) * step * 0.35
    }
  }

  return positions
}
