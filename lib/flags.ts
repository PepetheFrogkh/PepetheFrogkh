import type { CaseStudy } from '@/content'

/**
 * Les deux projets sous accord.
 *
 * Le cahier : « OCS et Wave n'apparaissent nulle part tant que SHOW_OCS et
 * SHOW_WAVE valent false. » Nulle part veut dire nulle part : ni dans une
 * liste, ni dans un menu, ni dans le sitemap, ni a leur propre adresse, qui
 * repond 404. C'est pour cela que le filtre vit ici, a cote de la table des
 * adresses, et pas seulement dans l'affichage.
 */

/**
 * OCS reste ferme : le projet n'est pas termine, et l'accord de publication
 * n'a pas ete demande. Il faut poser la variable a « true » pour l'ouvrir,
 * pas l'oublier pour le cacher.
 */
export const SHOW_OCS = process.env.NEXT_PUBLIC_SHOW_OCS === 'true'

/**
 * Wave est ouvert : le studio a demande a en parler, et la page est ecrite.
 * La variable sert desormais a le refermer, en la posant a « false », par
 * exemple si le client revient sur son accord. Le nom du client apparait donc
 * sur le site : l'accord ecrit releve de Kuiper Studio, pas du code.
 */
export const SHOW_WAVE = process.env.NEXT_PUBLIC_SHOW_WAVE !== 'false'

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
