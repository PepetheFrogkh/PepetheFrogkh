/**
 * La sequence d'images de l'en-tete.
 *
 * Le cahier : une animation 3D precalculee, dessinee image par image sur un
 * canvas selon la progression du defilement. Les vraies images seront
 * deposees dans `public/sequence/` ; en attendant, ce dossier contient une
 * sequence de test, et `PROVIDED` reste a faux pour que l'emplacement
 * [À FOURNIR] s'affiche par-dessus.
 *
 * Il suffira de remplacer les fichiers et de passer `PROVIDED` a vrai.
 */

/** Vrai quand les vraies images ont remplace la sequence de test. */
export const PROVIDED = false

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
