/**
 * The brand's own facts, in one place.
 *
 * Material and colour values used to live here too, for the realtime build.
 * They now belong to the Blender scene (`scripts/render/scene.py`), which is
 * where the look is actually decided — keeping a second copy here would only be
 * a copy to fall out of date.
 */
export type BeerId = 'lager' | 'black' | 'lite'

export interface Beer {
  id: BeerId
  name: string
  khmer: string
  /** Omitted where the brand has not published a figure. */
  abv?: string
  notes: string
  /** Out of scope for the maquette; the selector greys these out. */
  inFilm: boolean
}

export const BEERS: Beer[] = [
  {
    id: 'lager',
    name: 'Hanuman Premium Lager',
    khmer: 'ហនុមាន',
    abv: '4.9%',
    notes: 'Barley malt and a blend of premium hops. Gold medal, Monde Selection 2024.',
    inFilm: true,
  },
  {
    id: 'black',
    name: 'Hanuman Black',
    khmer: 'ហនុមាន',
    notes:
      'A 100% malt dark beer in the German tradition — caramel and honey notes, a fine bead, '
      + 'and a rounded, hop-finished palate. Gold medal, Monde Selection 2024.',
    inFilm: true,
  },
  {
    id: 'lite',
    name: 'Hanuman Lite',
    khmer: 'ហនុមាន',
    abv: '3.9%',
    notes: 'Naturally fermented and German-lagered. Light and soft.',
    inFilm: false,
  },
]

export const BREWERY = 'Brewed in Sen Sok, Phnom Penh, Cambodia.'
