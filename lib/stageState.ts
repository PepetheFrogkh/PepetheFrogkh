/**
 * Everything the scroll animates lives here, in a handful of mutable objects.
 *
 * The Director writes them once per frame from `scroll.progress`; each piece
 * of the scene is handed the object it cares about and reads it inside its own
 * `useFrame`. Nothing animated is ever a React prop, so the component tree
 * renders a handful of times for the whole page instead of sixty times a
 * second. The shapes match the `anim` props the components declare, so there
 * is no mapping layer to drift out of sync.
 */

export interface BottleState {
  frost: number
  drip: number
  capLift: number
  capSpin: number
  fill: number
  opacity: number
}

export const lager: BottleState = {
  frost: 0,
  drip: 0,
  capLift: 0,
  capSpin: 0,
  fill: 1,
  opacity: 0,
}

export const black: BottleState = {
  frost: 0,
  drip: 0,
  capLift: 0,
  capSpin: 0,
  fill: 1,
  opacity: 0,
}

/** The tumbler: fill level, head height in metres, visibility. */
export const tumbler = { fill: 0, foam: 0, opacity: 0 }

/** The stream between bottle mouth and glass. */
export const pour = { progress: 0, opacity: 0 }

/** The sunburst behind the hero. */
export const rays = { intensity: 0 }

/** Rig warmth: 0 = Lager daylight, 1 = Black's bar. */
export const look = { warmth: 0 }

/** The brand drop. `dark` crossfades it from gold to Black's near-black. */
export const drop = { y: 0.5, scale: 0, squash: 1, dark: 0 }

/** One-shot particle bursts, scrubbed by scroll. */
export const splashBurst = { t: 0 }
export const capBurst = { t: 0 }

/** Where things stand on the floor, and how they are turned. */
export const layout = { lagerX: 0, blackX: 0, tilt: 0, blackSpin: 0, plinth: 0 }

/**
 * What the camera is looking at, in world space. The depth of field reads the
 * same point, so the shot is always focused on whatever the plan is about.
 */
export const focus = { x: 0, y: 0.115, z: 0 }
