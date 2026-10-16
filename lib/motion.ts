import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Le socle du mouvement : GSAP et ScrollTrigger, enregistres une fois.
 *
 * Le cahier pose une regle qui gouverne tout ce fichier : le contenu est
 * visible par defaut, une animation ne cache jamais un texte plus de 300 ms,
 * et elle se declenche des que 15 % de la section est a l'ecran. `TRIGGER` et
 * `reduced()` sont donc utilises partout plutot que recopies.
 */

let registered = false

export function useGsap(): typeof gsap {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return gsap
}

export { ScrollTrigger }

/** Le seuil de declenchement du cahier : 15 % de la section a l'ecran. */
export const TRIGGER = 'top 85%'

/** Vrai quand le visiteur a demande moins d'animations. */
export function reduced(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Vrai sur un petit ecran, ou les effets sont alleges. */
export function small(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 720px)').matches
}
