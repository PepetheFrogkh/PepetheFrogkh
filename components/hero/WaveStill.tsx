/**
 * L'image fixe de la vague, en CSS.
 *
 * Elle tient la place tant que la scene n'a rien dessine, et reprend la main
 * quand WebGL manque ou que la machine n'arrive pas a suivre. Il n'y a donc
 * jamais de zone blanche a cet endroit.
 *
 * Ce ne sont pas des particules : ce sont trois arcs en degrade, aux memes
 * couleurs de charte, qui donnent la meme lecture de nappe lumineuse sans
 * demander une seule image par seconde. Decorative, donc `aria-hidden`.
 */
export default function WaveStill() {
  return (
    <div className="wave-still" aria-hidden="true">
      <span className="wave-still__arc wave-still__arc--1" />
      <span className="wave-still__arc wave-still__arc--2" />
      <span className="wave-still__arc wave-still__arc--3" />
      <span className="wave-still__grain" />
    </div>
  )
}
