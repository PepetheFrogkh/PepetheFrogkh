/**
 * Hanuman brand constants.
 *
 * Navy is sampled straight from the official logo banner (rgb 1,62,106).
 * Gold, copy and tasting notes come from the packaging and the brief — the
 * identity is staged here, never redesigned.
 */
export const BRAND = {
  navy: '#013e6a',
  navyDeep: '#01243d',
  navyInk: '#000d17',
  gold: '#d9a441',
  goldLight: '#f4d58d',
  goldDeep: '#9c6b1c',
  cream: '#f6f1e6',
  black: '#0a0a0c',
  blackWarm: '#15100b',
} as const

export type BeerId = 'lager' | 'black'

export interface Beer {
  id: BeerId
  name: string
  khmer: string
  /** Undefined where the brand has not published a figure (Black). */
  abv?: string
  notes: string[]
  labelBg: string
  /** Transmissive glass tint. */
  glass: string
  liquid: string
  foam: string
}

export const BEERS: Record<BeerId, Beer> = {
  lager: {
    id: 'lager',
    name: 'Premium Lager',
    khmer: 'ហនុមាន',
    abv: '4.9%',
    notes: ['Barley malt', 'Premium hops'],
    labelBg: BRAND.navy,
    glass: '#8d5a16',
    liquid: '#d99323',
    foam: '#f7edd8',
  },
  black: {
    id: 'black',
    name: 'Hanuman Black',
    khmer: 'ហនុមាន',
    notes: ['Caramel', 'Honey', 'Roasted malt'],
    labelBg: '#07070a',
    glass: '#140d05',
    liquid: '#160c03',
    foam: '#d9bd92',
  },
}

/** Real-world 330 ml long-neck, in metres — the scene is modelled to scale. */
export const BOTTLE_HEIGHT = 0.23
