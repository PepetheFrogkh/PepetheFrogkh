import type { CaseStudy } from '@/content'

/**
 * Les deux projets sous accord.
 *
 * Le cahier : « OCS et Wave n'apparaissent nulle part tant que SHOW_OCS et
 * SHOW_WAVE valent false. » Nulle part veut dire nulle part : ni dans une
 * liste, ni dans un menu, ni dans le sitemap, ni a leur propre adresse, qui
 * repond 404. C'est pour cela que le filtre vit ici, a cote de la table des
 * adresses, et pas seulement dans l'affichage.
 *
 * Les deux valent false par defaut : il faut poser la variable a « true » pour
 * les faire apparaitre, pas l'oublier pour les cacher.
 */
export const SHOW_OCS = process.env.NEXT_PUBLIC_SHOW_OCS === 'true'
export const SHOW_WAVE = process.env.NEXT_PUBLIC_SHOW_WAVE === 'true'

/** Les slugs tenus par un accord, et la variable qui les ouvre. */
const GATED: Record<string, boolean> = {
  ocs: SHOW_OCS,
  wave: SHOW_WAVE,
}

/** Vrai quand ce projet peut etre montre. */
export function allowed(slug: string): boolean {
  return GATED[slug] ?? true
}

/** Une liste de realisations, debarrassee de celles qui restent fermees. */
export function visibleCases(cases: CaseStudy[]): CaseStudy[] {
  return cases.filter((study) => allowed(study.slug))
}
