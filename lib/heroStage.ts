/**
 * L'acte courant du recit de l'en-tete, partage entre le DOM et le WebGL.
 *
 * L'en-tete est epingle et c'est ScrollTrigger qui mene : il ecrit ici, et la
 * boucle de rendu du champ de particules lit. Passer par un etat React ferait
 * un rendu par image, pour une valeur que seul un shader consomme.
 */
export const heroStage = {
  /** De 0 a 3 : ceinture, nuage, histogramme, cadres d'ecrans. */
  value: 0,
}
