import { Color } from 'three'

/**
 * Les deux etats du tableur, calcules une fois.
 *
 * Depart : une grille de tableur en desordre, cellules decalees et pivotees,
 * tons creme et gris.
 *
 * Arrivee : les memes cellules forment trois cartes d'application nettes, avec
 * un en-tete orange vif, des lignes peche et un fond blanc.
 *
 * Les deux etats ont exactement le meme nombre de cellules : c'est la meme
 * matiere qui se range, pas une forme qui en remplace une autre.
 */

export const CARDS = ['Planning', 'Clients', 'Interventions'] as const

/**
 * La grille d'une carte : dix colonnes, dix rangees, soit cent cellules.
 *
 * Seize rangees donnaient des cellules minuscules qui se lisaient comme du
 * bruit. Dix rangees, c'est un en-tete et neuf lignes : une carte
 * d'application.
 */
const CARD_COLS = 10
const CARD_ROWS = 10
const PER_CARD = CARD_COLS * CARD_ROWS

/** Le compte total est un multiple de trois cartes. */
export const DESKTOP_COUNT = PER_CARD * 3 // 300
export const MOBILE_COUNT = 150

export const CARD_W = 1.55
export const CARD_H = 2.1
const CARD_GAP = 0.28

/** L'abscisse du centre de chaque carte, en unites de scene. */
export const CARD_X = [-(CARD_W + CARD_GAP), 0, CARD_W + CARD_GAP]

/** La camera, partagee avec la page qui projette les noms des cartes. */
export const CAMERA = { z: 5.4, fov: 38, tilt: -0.11 }

/** La taille d'une cellule : un peu plus petite que son pas, pour voir la grille. */
export const CELL = {
  w: (CARD_W / CARD_COLS) * 0.86,
  h: (CARD_H / CARD_ROWS) * 0.84,
  d: 0.045,
  radius: 0.016,
}

const INK = new Color('#14161F')
const PAPER_A = new Color('#E9E2DA')
const PAPER_B = new Color('#DCD3C9')
const WHITE = new Color('#FFFFFF')
const PEACH = new Color('#FFE3CF')
const ORANGE = new Color('#FF6B00')

export interface CellLayout {
  /** l'etat de depart : la grille en desordre */
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
 * On suit la couverture de la proposition : un en-tete orange en haut, puis
 * des barres peche de longueur variable separees par du blanc. Les cellules
 * qui ne portent ni l'en-tete ni une barre se resserrent et deviennent la
 * trame fine du fond.
 */
function role(
  col: number,
  row: number,
  barLength: number,
): { color: Color; scale: number; behind: boolean } {
  // l'en-tete : une seule rangee pleine, sur les deux tiers de la largeur
  if (row === 0) {
    return col < Math.round(CARD_COLS * 0.62)
      ? { color: ORANGE, scale: 1, behind: false }
      : { color: WHITE, scale: 0.3, behind: true }
  }

  // une barre une rangee sur deux
  if (row % 2 === 1 && row <= 7) {
    return col < barLength
      ? { color: PEACH, scale: 1, behind: false }
      : { color: WHITE, scale: 0.3, behind: true }
  }

  return { color: WHITE, scale: 0.3, behind: true }
}

export function buildLayout(count: number): CellLayout[] {
  const random = rng(7)
  const cells: CellLayout[] = []

  // ── la grille du tableur : large et basse, comme une feuille de calcul ──
  const gridCols = Math.ceil(Math.sqrt(count * 2.2))
  const gridRows = Math.ceil(count / gridCols)
  const pitchX = 7.4 / gridCols
  const pitchY = 3.1 / gridRows

  // la grille d'une carte, pour l'etat d'arrivee
  const perCard = Math.floor(count / 3)
  const cardCols = count === DESKTOP_COUNT ? CARD_COLS : Math.ceil(Math.sqrt(perCard * 0.62))
  const cardRows = Math.ceil(perCard / cardCols)
  const cardPitchX = CARD_W / cardCols
  const cardPitchY = CARD_H / cardRows

  for (let i = 0; i < count; i++) {
    // ── depart ────────────────────────────────────────────────────────────
    const gc = i % gridCols
    const gr = Math.floor(i / gridCols)
    // Le desordre reste un tableau : les ecarts sont assez petits pour qu'on
    // lise encore des lignes et des colonnes, sinon ce n'est plus un tableur
    // mais un nuage.
    const fx = (gc - (gridCols - 1) / 2) * pitchX + (random() - 0.5) * pitchX * 0.2
    const fy = ((gridRows - 1) / 2 - gr) * pitchY + (random() - 0.5) * pitchY * 0.22
    const fz = (random() - 0.5) * 0.12

    // ── arrivee ───────────────────────────────────────────────────────────
    const card = Math.floor(i / perCard)
    const indexInCard = i - card * perCard
    const cc = indexInCard % cardCols
    const cr = Math.floor(indexInCard / cardCols)
    const cardIndex = Math.min(card, 2)
    const cardX = CARD_X[cardIndex]
    const perCardRow = cardRows
    const tx = cardX + (cc - (cardCols - 1) / 2) * cardPitchX
    const ty = ((cardRows - 1) / 2 - cr) * cardPitchY
    // les cartes laterales reculent legerement : la perspective fait le reste
    const front = cardIndex === 1 ? 0.06 : -0.02

    // la vague de rangement part du centre de la grille
    const dist = Math.hypot(fx / 3.7, fy / 1.55)
    const order = Math.min(1, dist * 0.82 + random() * 0.12)

    // une longueur de barre par rangee et par carte, stable d'un rendu a
    // l'autre : deux cellules de la meme rangee doivent s'accorder
    const barLength = 3 + ((cardIndex * 7 + cr * 3) % (CARD_COLS - 4))
    const { color: toColor, scale: toScale, behind } = role(cc, cr, barLength)

    cells.push({
      from: {
        x: fx,
        y: fy,
        z: fz,
        rx: (random() - 0.5) * 0.22,
        ry: (random() - 0.5) * 0.22,
        rz: (random() - 0.5) * 0.3,
      },
      // Les cellules qui ne portent ni l'en-tete ni une barre passent derriere
      // la plaque : elles forment le corps de la carte au lieu de se lire comme
      // des points gris poses dessus.
      to: { x: tx, y: ty, z: behind ? -0.14 : front },
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
