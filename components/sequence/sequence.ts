/**
 * La sequence d'images de l'en-tete.
 *
 * Une animation 3D precalculee, dessinee image par image sur un canvas selon
 * la progression du defilement. Les images vivent dans `public/sequence/` et
 * la scene qui les produit dans `scripts/sequence/scene.html` : elle se
 * modifie et se rend a nouveau, voir le README du dossier.
 *
 * Rien de la 3D ne part dans le navigateur du visiteur : il ne recoit que des
 * WebP, donc ni Three.js, ni WebGL, ni repli a prevoir pour qui n'en a pas.
 */

/** Vrai des lors que les images du dossier sont la vraie sequence. */
export const PROVIDED = true

export const DESKTOP = { frames: 144, folder: 'desktop', width: 1600, height: 900 }
export const MOBILE = { frames: 60, folder: 'mobile', width: 800, height: 1200 }

export type SequenceSet = typeof DESKTOP

/** L'adresse d'une image, numerotee a partir de 1 sur quatre chiffres. */
export function frameUrl(set: SequenceSet, index: number): string {
  return `/sequence/${set.folder}/${String(index + 1).padStart(4, '0')}.webp`
}

/** Les images chargees avant de rendre la main : la suite arrive derriere. */
export const EAGER = 10

/** Combien d'images se chargent en parallele, une fois les premieres la. */
export const CONCURRENCY = 6
