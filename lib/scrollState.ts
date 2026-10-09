/**
 * Scroll is read every frame inside the render loop, so the value itself lives
 * in a plain mutable object rather than in React state — writing it to a store
 * 60 times a second would re-render the whole tree. React only ever hears
 * about discrete changes (which scene is active, the age gate, quality tier).
 */
export const scroll = {
  /** 0 → 1 across the whole page. */
  progress: 0,
  /** Signed scroll velocity, normalised; drives small inertial touches. */
  velocity: 0,
  /** Pointer in NDC, for the light parallax. */
  pointerX: 0,
  pointerY: 0,
}

export interface Scene {
  id: string
  /** Plan number in the brief, kept so the deck and the code line up. */
  plan: number
  start: number
  end: number
  title: string
  sub?: string
  notes?: string[]
}

/**
 * The six plans of the film, as ranges of the scroll. These boundaries must
 * match the ones in `scripts/render/scene.py`: the copy is timed to what the
 * rendered frames are actually showing.
 */
export const SCENES: Scene[] = [
  { id: 'drop', plan: 1, start: 0.0, end: 0.17, title: 'Greatness in every drop.' },
  {
    id: 'condensation',
    plan: 2,
    start: 0.17,
    end: 0.35,
    title: 'Ice cold. Always.',
    sub: 'Hanuman Premium Lager',
  },
  { id: 'open', plan: 3, start: 0.35, end: 0.5, title: 'Pssht.' },
  {
    id: 'pour',
    plan: 4,
    start: 0.5,
    end: 0.76,
    title: 'Golden. Crisp. 4.9%.',
    sub: 'Barley malt · Premium hops',
  },
  {
    id: 'black',
    plan: 6,
    start: 0.76,
    end: 0.87,
    title: 'Deep. Dark. Smooth.',
    sub: 'Caramel · Honey · Roasted malt',
  },
  { id: 'cta', plan: 9, start: 0.87, end: 1.0, title: 'Find your Hanuman.' },
]

/** Total page height. Roughly one and a bit viewports per plan. */
export const SCROLL_VH = SCENES.length * 115

export function sceneAt(p: number) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (p >= SCENES[i].start) return i
  return 0
}

/** 0 → 1 within a scene's own range. */
export function localProgress(p: number, s: Scene) {
  return clamp01((p - s.start) / (s.end - s.start))
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

/** Remap v from [a,b] to [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))

export const smoothstep = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}

export const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** Frame-rate independent exponential approach. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))
