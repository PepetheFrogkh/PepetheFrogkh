import { Color } from 'three'

/**
 * Les deux etats du tableur, calcules une fois.
 *
 * Depart : une feuille de calcul en desordre, cellules decalees et pivotees,
 * tons creme et gris.
 *
 * Arrivee : les memes cellules forment trois cartes d'application nettes,
 * empilees, avec un en-tete orange vif, des lignes peche et un fond blanc.
 *
 * Les deux etats ont exactement le meme nombre de cellules : c'est la meme
 * matiere qui se range, pas une forme qui en remplace une autre.
 *
 * Les cartes sont en paysage et empilees, et non cote a cote : la scene occupe
 * la moitie droite de l'ecran, donc un cadre plus haut que large. Trois cartes
 * cote a cote y seraient trois timbres illisibles.
 */

export const CARDS = ['Planning', 'Clients', 'Interventions'] as const

/**
 * Les deux formats, et le nombre de cellules qui en decoule.
 *
 * `card` est la grille d'une carte, `grid` celle de la feuille de depart. Les
 * deux ont le meme nombre de colonnes : on lit tout de suite que ce sont les
 * memes cellules, rangees autrement.
 */
const SHAPES = {
  large: { card: { cols: 14, rows: 7 }, grid: { cols: 14, rows: 21 } },
  small: { card: { cols: 10, rows: 5 }, grid: { cols: 10, rows: 15 } },
} as const

export const DESKTOP_COUNT = 14 * 7 * 3 // 294
export const MOBILE_COUNT = 10 * 5 * 3 // 150

function shape(count: number) {
  return count === MOBILE_COUNT ? SHAPES.small : SHAPES.large
}

/** Une carte : en paysage, deux fois et demie plus large que haute. */
export const CARD_W = 2.6
export const CARD_H = 1
const CARD_GAP = 0.3

/** L'ordonnee du centre de chaque carte, en unites de scene. */
export const CARD_Y = [CARD_H + CARD_GAP, 0, -(CARD_H + CARD_GAP)]

/** L'etendue de la feuille de depart. */
const SHEET_W = 3.3
const SHEET_H = 3.9

/**
 * La place qu'il faut pour tout voir, en unites de scene, depuis le centre.
 *
 * La pile de cartes est plus haute que la feuille est large : c'est elle qui
 * commande la hauteur, et la feuille la largeur.
 */
export const EXTENT = {
  halfWidth: Math.max(CARD_W, SHEET_W) / 2 + 0.2,
  // 0,45 au-dessus de la carte du haut : c'est la place du nom de la carte,
  // qui est pose en HTML par-dessus la scene et serait sinon hors cadre
  halfHeight: Math.max(CARD_Y[0] + CARD_H / 2 + 0.45, SHEET_H / 2) + 0.2,
}

export const CAMERA = { fov: 38, tilt: -0.08 }

const HALF_FOV = Math.tan(((CAMERA.fov / 2) * Math.PI) / 180)

/**
 * La distance de la camera pour que tout tienne dans un cadre de ce rapport.
 *
 * Elle est calculee et non figee : la scene occupe la moitie droite sur grand
 * ecran et le bas de l'ecran sur mobile, donc son rapport largeur sur hauteur
 * change du simple au double et une valeur en dur recadrerait de travers.
 */
export function fitDistance(aspect: number): number {
  const forHeight = EXTENT.halfHeight / HALF_FOV
  const forWidth = EXTENT.halfWidth / (HALF_FOV * Math.max(0.2, aspect))
  return Math.max(forHeight, forWidth)
}

/** La demi-hauteur et la demi-largeur vues a cette distance. */
export function viewHalf(aspect: number): { w: number; h: number } {
  const h = HALF_FOV * fitDistance(aspect)
  return { h, w: h * aspect }
}

/** La taille d'une cellule : un peu plus petite que son pas, pour voir la grille. */
export function cellSize(count: number) {
  const { card } = shape(count)
  // La largeur occupe tout le pas et la hauteur la moitie : rangees, les
  // cellules se touchent et forment des barres continues ; en feuille, elles
  // s'ecartent et redeviennent des lignes de tableur.
  return {
    w: CARD_W / card.cols,
    h: (CARD_H / card.rows) * 0.5,
    d: 0.045,
  }
}

const PAPER_A = new Color('#E9E2DA')
const PAPER_B = new Color('#DCD3C9')
const WHITE = new Color('#FFFFFF')
const PEACH = new Color('#FFE3CF')
const ORANGE = new Color('#FF6B00')
const INK = new Color('#14161F')

export interface CellLayout {
  /** l'etat de depart : la feuille en desordre */
  from: { x: number; y: number; z: number; rx: number; ry: number; rz: number }
  /** l'etat d'arrivee : les trois cartes */
  to: { x: number; y: number; z: number }
  /**
   * L'echelle a l'arrivee. Une carte d'application n'est pas une grille
   * uniforme : son en-tete et ses lignes sont pleins, le reste n'est qu'une
   * fine texture. Les cellules de fond se resserrent donc, au lieu de
   * disparaitre.
   */
  toScale: number
  fromColor: Color
  toColor: Color
  /**
   * L'ordre de rangement, de 0 a 1 : les cellules ne se rangent pas toutes en
   * meme temps, elles partent du centre vers les bords, ce qui donne une vague
   * plutot qu'un basculement d'un bloc.
   */
  order: number
}

/** Un generateur reproductible : la mise en page ne doit pas sauter au rechargement. */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/**
 * Le role d'une cellule dans sa carte.
 *
 * Un en-tete orange en haut, des barres peche une rangee sur deux, et une
 * barre courte tout en bas comme un bouton. Les cellules qui ne portent rien
 * de tout cela se resserrent et passent derriere la plaque : elles forment le
 * corps de la carte au lieu de se lire comme des points gris.
 */
function role(
  col: number,
  row: number,
  cols: number,
  rows: number,
  barLength: number,
): { color: Color; scale: number; behind: boolean } {
  const plein = (color: Color) => ({ color, scale: 1, behind: false })
  const trame = { color: WHITE, scale: 0.3, behind: true }

  if (row === 0) return col < Math.round(cols * 0.5) ? plein(ORANGE) : trame
  if (row === rows - 1) return col < Math.round(cols * 0.26) ? plein(PEACH) : trame
  if (row % 2 === 0) return col < barLength ? plein(PEACH) : trame
  return trame
}

export function buildLayout(count: number): CellLayout[] {
  const random = rng(7)
  const { card, grid } = shape(count)
  const cells: CellLayout[] = []

  const pitchX = SHEET_W / grid.cols
  const pitchY = SHEET_H / grid.rows

  const perCard = card.cols * card.rows
  const cardPitchX = CARD_W / card.cols
  const cardPitchY = CARD_H / card.rows

  for (let i = 0; i < count; i++) {
    // ── depart : la feuille de calcul ─────────────────────────────────────
    const gc = i % grid.cols
    const gr = Math.floor(i / grid.cols)
    // Le desordre reste un tableau : les ecarts sont assez petits pour qu'on
    // lise encore des lignes et des colonnes, sinon ce n'est plus un tableur
    // mais un nuage.
    const fx = (gc - (grid.cols - 1) / 2) * pitchX + (random() - 0.5) * pitchX * 0.22
    const fy = ((grid.rows - 1) / 2 - gr) * pitchY + (random() - 0.5) * pitchY * 0.3
    const fz = (random() - 0.5) * 0.12

    // ── arrivee : les trois cartes ────────────────────────────────────────
    const cardIndex = Math.min(2, Math.floor(i / perCard))
    const indexInCard = i - cardIndex * perCard
    const cc = indexInCard % card.cols
    const cr = Math.floor(indexInCard / card.cols)
    const tx = (cc - (card.cols - 1) / 2) * cardPitchX
    const ty = CARD_Y[cardIndex] + ((card.rows - 1) / 2 - cr) * cardPitchY

    // la vague de rangement part du centre de la feuille
    const dist = Math.hypot(fx / (SHEET_W / 2), fy / (SHEET_H / 2))
    const order = Math.min(1, dist * 0.78 + random() * 0.12)

    // une longueur de barre par rangee et par carte, stable d'un rendu a
    // l'autre : deux cellules de la meme rangee doivent s'accorder
    const barLength = 4 + ((cardIndex * 5 + cr * 3) % Math.max(2, card.cols - 5))
    const { color: toColor, scale: toScale, behind } = role(cc, cr, card.cols, card.rows, barLength)

    cells.push({
      from: {
        x: fx,
        y: fy,
        z: fz,
        rx: (random() - 0.5) * 0.22,
        ry: (random() - 0.5) * 0.22,
        rz: (random() - 0.5) * 0.3,
      },
      to: { x: tx, y: ty, z: behind ? -0.3 : 0.04 },
      toScale,
      fromColor: (gc + gr) % 2 === 0 ? PAPER_A : PAPER_B,
      toColor,
      order,
    })
  }

  return cells
}

/** La couleur de l'encre, pour les materiaux qui en ont besoin. */
export { INK }
