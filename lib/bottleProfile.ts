import * as THREE from 'three'
import { BOTTLE_HEIGHT } from './brand'

/**
 * Lathe profile for the 330 ml long-neck, in metres.
 *
 * Derived from the silhouettes of the two official packshots: both measure
 * 3.70–3.76 total heights per body diameter, body ≈ 0.92 of the widest point,
 * shoulder break at 62% of the height, neck settling at 0.45. See
 * `public/data/measured-profile-*.json` for the raw per-row measurements and
 * `scripts/measure-packshot.py` for how they were taken.
 *
 * Meshy's GLBs are only used as a cross-check on these proportions: at 221k–364k
 * triangles with a single opaque material welding glass and label together they
 * cannot be made transmissive, which is the whole point of the hero shot.
 */
const H = BOTTLE_HEIGHT
const R = H / 3.72 / 2 // widest radius ≈ 30.9 mm

/** [radius, height] pairs, bottom to top, normalised then scaled. */
const PROFILE: [number, number][] = [
  [0.0, 0.0],
  [0.78, 0.0],
  [0.93, 0.006],
  [1.0, 0.018],
  [0.985, 0.03],
  [0.975, 0.1],
  [0.973, 0.3],
  [0.975, 0.5],
  [0.985, 0.57],
  [1.0, 0.605],
  [0.995, 0.63],
  [0.955, 0.665],
  [0.86, 0.7],
  [0.73, 0.73],
  [0.63, 0.757],
  [0.565, 0.785],
  [0.525, 0.82],
  [0.5, 0.865],
  [0.478, 0.915],
  [0.47, 0.945],
  [0.5, 0.957],
  [0.52, 0.968],
  [0.5, 0.98],
  [0.47, 0.985],
  [0.47, 1.0],
  [0.0, 1.0],
]

export interface LatheOptions {
  /** Radial segments. 96 reads as perfectly round at hero scale, 48 on mobile. */
  segments?: number
  /** Shrink for the inner wall of the glass, in metres. */
  inset?: number
  /** Cut the profile at this fraction of the height (used for the liquid). */
  topFraction?: number
}

export function bottlePoints({ inset = 0, topFraction = 1 }: LatheOptions = {}) {
  const pts: THREE.Vector2[] = []
  for (const [r, t] of PROFILE) {
    if (t > topFraction) break
    pts.push(new THREE.Vector2(Math.max(0, r * R - inset), t * H))
  }
  if (topFraction < 1) {
    // cap the cut with a flat disc so the liquid reads as a surface
    const last = pts[pts.length - 1]
    pts.push(new THREE.Vector2(0, last.y))
  }
  return pts
}

export function bottleGeometry(opts: LatheOptions = {}) {
  const g = new THREE.LatheGeometry(bottlePoints(opts), opts.segments ?? 96)
  g.computeVertexNormals()
  return g
}

/** Radius of the bottle at a given height fraction — used to place the label. */
export function radiusAt(t: number) {
  for (let i = 1; i < PROFILE.length; i++) {
    const [r0, t0] = PROFILE[i - 1]
    const [r1, t1] = PROFILE[i]
    if (t >= t0 && t <= t1) {
      const k = t1 === t0 ? 0 : (t - t0) / (t1 - t0)
      return (r0 + (r1 - r0) * k) * R
    }
  }
  return R
}

/** The cylindrical body band the paper label wraps, as height fractions. */
export const LABEL_BAND: [number, number] = [0.22, 0.6]
/** The gold foil collar on the neck. */
export const COLLAR_BAND: [number, number] = [0.78, 0.95]
export { R as BOTTLE_RADIUS, H as BOTTLE_H }
