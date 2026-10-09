'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scroll, SCENES, localProgress, range, smoothstep, mix, damp } from '@/lib/scrollState'
import {
  lager,
  black,
  tumbler,
  pour,
  rays,
  look,
  drop,
  splashBurst,
  capBurst,
  layout,
  focus,
} from '@/lib/stageState'
import { BOTTLE_H } from '@/lib/bottleProfile'
import { GLASS_H } from './Tumbler'

/**
 * The storyboard, in one function.
 *
 * Every frame this reads `scroll.progress`, writes the whole of `stage`, and
 * places the camera. It is the only place in the project where the narrative
 * lives — the scene components below it just render whatever `stage` says.
 * Keeping it in one file is deliberate: changing a beat during the pitch means
 * editing numbers here and nowhere else.
 *
 * The camera is never cut. Its position is expressed as an orbit (angle,
 * radius, height) that runs monotonically from 0 to about 2π across the page,
 * so every plan change is a continuous move.
 */

const GLASS_X = 0.075
const LAGER_PARKED_X = -0.075

/** Easing used for anything that should feel like weight falling. */
const easeIn = (t: number) => t * t * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

interface Shot {
  angle: number
  radius: number
  height: number
  target: THREE.Vector3
  fov: number
}

export default function Director() {
  const { camera, size } = useThree()
  const shot = useRef<Shot>({
    angle: 0,
    radius: 0.42,
    height: 0.3,
    target: new THREE.Vector3(0, 0.16, 0),
    fov: 34,
  })
  const current = useRef<Shot>({
    angle: 0,
    radius: 0.42,
    height: 0.3,
    target: new THREE.Vector3(0, 0.16, 0),
    fov: 34,
  })
  const tmpTarget = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    const p = scroll.progress
    const S = SCENES

    // portrait and small screens need the camera further out to frame a
    // 23 cm bottle without cropping it
    const aspect = size.width / Math.max(size.height, 1)
    const widen = aspect < 1 ? 1.45 : aspect < 1.4 ? 1.15 : 1

    // ── defaults each frame, so a scene never leaks state into the next ──
    splashBurst.t = 0
    capBurst.t = 0

    // ── plan 1 · the drop ────────────────────────────────────────────────
    {
      const l = localProgress(p, S[0])
      const fall = range(l, 0.0, 0.46)
      drop.scale = range(l, 0.0, 0.12) * (1 - range(l, 0.46, 0.56))
      drop.y = mix(0.32, 0.013, easeIn(fall))
      // squash at the moment of impact
      const hit = range(l, 0.4, 0.48) * (1 - range(l, 0.48, 0.58))
      drop.squash = 1 - hit * 0.65
      drop.dark = 0
      splashBurst.t = range(l, 0.45, 0.85)
      rays.intensity = range(l, 0.46, 0.95)

      shot.current.angle = mix(0, 0.1, l)
      shot.current.radius = mix(0.62, 0.47, smoothstep(l)) * widen
      shot.current.height = mix(0.2, 0.145, smoothstep(l))
      shot.current.target.set(0, mix(0.145, 0.115, smoothstep(l)), 0)
      shot.current.fov = 34
    }

    // the impact reveals the bottle, which then stays for three plans
    lager.opacity = easeOut(range(p, S[0].start + 0.062, S[0].start + 0.105))

    // ── plan 2 · condensation ────────────────────────────────────────────
    if (p >= S[1].start) {
      const l = localProgress(p, S[1])
      lager.frost = range(l, 0.04, 0.55)
      lager.drip = range(l, 0.25, 1) * 1.15
      rays.intensity = mix(1, 0.4, range(l, 0, 0.5))

      shot.current.angle = mix(0.1, Math.PI, smoothstep(l))
      shot.current.radius = mix(0.47, 0.42, smoothstep(l)) * widen
      shot.current.height = mix(0.145, 0.115, smoothstep(l))
      shot.current.target.set(0, mix(0.115, 0.112, l), 0)
      shot.current.fov = mix(34, 32, l)
    } else {
      lager.frost = 0
      lager.drip = 0
    }

    // ── plan 3 · the crown comes off ─────────────────────────────────────
    if (p >= S[2].start) {
      const l = localProgress(p, S[2])
      // the crown lifts, hangs for a beat so the pop is readable, then goes
      const pop = range(l, 0.34, 0.5)
      lager.capLift = easeOut(pop) * 0.045 + easeIn(range(l, 0.68, 1)) * 0.34
      lager.capSpin = easeOut(pop) * 1.6 + easeIn(range(l, 0.68, 1)) * 12
      capBurst.t = range(l, 0.36, 0.96)

      shot.current.angle = mix(Math.PI, Math.PI * 1.2, smoothstep(l))
      shot.current.radius = mix(0.42, 0.26, smoothstep(l)) * widen
      shot.current.height = mix(0.115, 0.27, smoothstep(l))
      shot.current.target.set(0, mix(0.112, BOTTLE_H * 1.12, smoothstep(l)), 0)
      shot.current.fov = mix(32, 30, smoothstep(l))
    } else {
      lager.capLift = 0
      lager.capSpin = 0
    }

    // ── plan 4 · the pour ────────────────────────────────────────────────
    if (p >= S[3].start) {
      const l = localProgress(p, S[3])
      layout.lagerX = mix(0, LAGER_PARKED_X, smoothstep(range(l, 0.02, 0.3)))
      layout.tilt = -1.12 * smoothstep(range(l, 0.1, 0.46)) * (1 - smoothstep(range(l, 0.74, 0.95)))
      lager.fill = mix(1, 0.12, range(l, 0.2, 0.72))

      pour.progress = smoothstep(range(l, 0.24, 0.42))
      pour.opacity = range(l, 0.22, 0.3) * (1 - range(l, 0.7, 0.82))

      tumbler.opacity = range(l, 0.0, 0.08)
      tumbler.fill = smoothstep(range(l, 0.3, 0.74)) * 0.74
      // the head overshoots, then settles — the detail that sells a pour
      const rise = smoothstep(range(l, 0.32, 0.62))
      const settle = smoothstep(range(l, 0.62, 0.92))
      tumbler.foam = mix(0, 0.026, rise) - mix(0, 0.012, settle)

      // orbit back round to the front, then dive on the glass
      shot.current.angle = mix(Math.PI * 1.2, Math.PI * 2, smoothstep(range(l, 0, 0.55)))
      shot.current.radius = mix(0.26, 0.56, smoothstep(range(l, 0, 0.42))) * widen
      shot.current.radius = mix(shot.current.radius, 0.34 * widen, smoothstep(range(l, 0.64, 1)))
      shot.current.height = mix(0.27, 0.17, smoothstep(range(l, 0, 0.42)))
      shot.current.height = mix(shot.current.height, 0.085, smoothstep(range(l, 0.64, 1)))
      const tx = mix(0, GLASS_X, smoothstep(range(l, 0.1, 0.62)))
      const ty = mix(0.112, GLASS_H * 0.52, smoothstep(range(l, 0.1, 0.72)))
      shot.current.target.set(tx, ty, 0)
      shot.current.fov = mix(30, 33, smoothstep(range(l, 0, 0.42)))
    } else {
      layout.lagerX = 0
      layout.tilt = 0
      lager.fill = 1
      pour.progress = 0
      pour.opacity = 0
      tumbler.opacity = 0
      tumbler.fill = 0
      tumbler.foam = 0
    }

    // ── plan 6 · Black ───────────────────────────────────────────────────
    if (p >= S[4].start) {
      const l = localProgress(p, S[4])
      look.warmth = smoothstep(range(l, 0, 0.4))
      lager.opacity = 1 - range(l, 0.02, 0.22)
      tumbler.opacity = Math.min(tumbler.opacity, 1 - range(l, 0.0, 0.18))
      black.opacity = range(l, 0.2, 0.44)
      layout.blackX = 0
      layout.blackSpin = l * 2.0
      rays.intensity = mix(0.4, 0.55, l)
      // the drop comes back, black, to carry the transition
      drop.scale = range(l, 0.02, 0.14) * (1 - range(l, 0.24, 0.34))
      drop.y = mix(0.36, BOTTLE_H * 0.58, easeIn(range(l, 0.02, 0.26)))
      drop.squash = 1
      drop.dark = 1

      shot.current.angle = mix(Math.PI * 2, Math.PI * 2.22, smoothstep(l))
      shot.current.radius = mix(0.34, 0.45, smoothstep(range(l, 0, 0.45))) * widen
      shot.current.height = mix(0.085, 0.13, smoothstep(range(l, 0, 0.45)))
      shot.current.target.set(
        mix(GLASS_X, 0, smoothstep(range(l, 0, 0.3))),
        mix(GLASS_H * 0.52, 0.115, smoothstep(range(l, 0, 0.35))),
        0,
      )
      shot.current.fov = 33
    } else {
      look.warmth = 0
      black.opacity = 0
      layout.blackSpin = 0
    }

    // ── plan 9 · the line-up and the call to action ──────────────────────
    if (p >= S[5].start) {
      const l = localProgress(p, S[5])
      layout.plinth = smoothstep(range(l, 0, 0.4))
      look.warmth = mix(1, 0.62, smoothstep(range(l, 0, 0.5)))
      lager.opacity = range(l, 0.08, 0.35)
      lager.frost = 0
      lager.drip = 0
      lager.capLift = 0
      lager.fill = 1
      layout.tilt = 0
      black.opacity = 1
      layout.lagerX = mix(0, -0.082, smoothstep(range(l, 0.05, 0.45)))
      layout.blackX = mix(0, 0.082, smoothstep(range(l, 0.05, 0.45)))
      // finish the turn so Black faces the camera square-on beside the Lager
      layout.blackSpin = mix(2.0, Math.PI * 2, smoothstep(l))
      rays.intensity = mix(0.55, 0.85, smoothstep(l))

      // the drop settles between the two bottles
      drop.scale = range(l, 0.3, 0.5) * 0.8
      drop.y = mix(0.26, 0.012, smoothstep(range(l, 0.3, 0.72)))
      drop.squash = 1 - range(l, 0.72, 0.9) * 0.25
      drop.dark = 1 - smoothstep(range(l, 0.1, 0.45))

      // back to square-on: the line-up only reads from the front
      shot.current.angle = mix(Math.PI * 2.22, Math.PI * 2, smoothstep(l))
      shot.current.radius = mix(0.45, 0.78, smoothstep(l)) * widen
      shot.current.height = mix(0.13, 0.17, smoothstep(l))
      shot.current.target.set(0, mix(0.115, 0.105, l), 0)
      shot.current.fov = mix(33, 34, smoothstep(l))
    } else {
      layout.plinth = 0
    }

    // ── place the camera ─────────────────────────────────────────────────
    const c = current.current
    const t = shot.current
    // light damping: the scroll is already smoothed by Lenis, this only takes
    // the edge off trackpad flicks
    const k = 9
    c.angle = damp(c.angle, t.angle, k, dt)
    c.radius = damp(c.radius, t.radius, k, dt)
    c.height = damp(c.height, t.height, k, dt)
    c.fov = damp(c.fov, t.fov, k, dt)
    c.target.lerp(t.target, 1 - Math.exp(-k * dt))

    // a touch of pointer parallax, so the shot breathes when the page is still
    const px = scroll.pointerX * 0.035
    const py = scroll.pointerY * 0.02

    camera.position.set(
      Math.sin(c.angle) * c.radius + px * c.radius,
      c.height + py * c.radius,
      Math.cos(c.angle) * c.radius,
    )
    tmpTarget.current.copy(c.target)
    camera.lookAt(tmpTarget.current)
    focus.x = c.target.x
    focus.y = c.target.y
    focus.z = c.target.z
    const cam = camera as THREE.PerspectiveCamera
    if (Math.abs(cam.fov - c.fov) > 0.01) {
      cam.fov = c.fov
      cam.updateProjectionMatrix()
    }
  })

  return null
}
