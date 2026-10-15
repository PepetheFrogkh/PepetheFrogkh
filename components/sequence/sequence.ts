/**
 * La sequence d'images de l'accueil.
 *
 * Une animation 3D precalculee, dessinee image par image sur un canvas selon
 * la progression du defilement. Les images vivent dans `public/sequence/` et
 * la scene qui les produit dans `scripts/sequence/scene.html` : elle se
 * modifie et se rend a nouveau, voir `public/sequence/README.md`.
 *
 * Rien de la 3D ne part dans le navigateur du visiteur : il ne recoit que des
 * WebP, donc ni Three.js, ni WebGL, ni repli a prevoir pour qui n'en a pas.
 */

/** Vrai des lors que les images du dossier sont la vraie sequence. */
export const PROVIDED = true

export interface SequenceSet {
  frames: number
  folder: string
  width: number
  height: number
}

/**
 * Deux definitions par orientation.
 *
 * Un canvas plein ecran sur un portable retine fait 2880 pixels de large :
 * une image de 1920 y est etiree d'un tiers et l'animation parait floue, ce
 * qui etait le cas jusqu'ici. Le jeu double couvre jusqu'au 4K. Les deux
 * existent parce que servir du 4K a un ecran ordinaire ferait telecharger
 * 8 Mo pour une image qu'il reduirait aussitot.
 */
export const DESKTOP: SequenceSet[] = [
  { frames: 144, folder: 'desktop', width: 1920, height: 1080 },
  { frames: 144, folder: 'desktop-2x', width: 3840, height: 2160 },
]

export const MOBILE: SequenceSet[] = [
  { frames: 60, folder: 'mobile', width: 900, height: 1350 },
  { frames: 60, folder: 'mobile-2x', width: 1800, height: 2700 },
]

/**
 * Combien de pixels par point on accepte de dessiner.
 *
 * Deux sur un grand ecran : au-dela, un canvas plein ecran depasse les huit
 * millions de pixels a repeindre a chaque image, et la page saccade. Trois
 * sur un telephone, parce que la surface y est petite : 390 points a trois
 * font 1170 pixels de large, soit moins de pixels au total qu'un portable
 * retine. C'est ce qui permet aux telephones modernes, presque tous en dpr 3,
 * d'avoir une image nette au lieu d'une image etiree d'un tiers.
 */
export function density(small: boolean, dpr: number): number {
  return Math.min(small ? 3 : 2, dpr || 1)
}

/**
 * Le jeu a servir pour un canvas de cette largeur, en pixels reels.
 *
 * Le premier qui couvre la largeur demandee, sinon le plus grand. Un ecart de
 * dix pour cent passe : personne ne voit une image reduite de 1,1, et cela
 * evite de basculer tout un ecran retine sur le jeu 4K pour trente pixels.
 */
export function pick(sets: SequenceSet[], pixels: number): SequenceSet {
  return sets.find((set) => set.width * 1.1 >= pixels) ?? sets[sets.length - 1]
}

/** L'adresse d'une image, numerotee a partir de 1 sur quatre chiffres. */
export function frameUrl(set: SequenceSet, index: number): string {
  return `/sequence/${set.folder}/${String(index + 1).padStart(4, '0')}.webp`
}

/** Les images chargees avant de rendre la main : la suite arrive derriere. */
export const EAGER = 10

/** Combien d'images se chargent en parallele, une fois les premieres la. */
export const CONCURRENCY = 6
