'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'
import { BEERS, BRAND } from '@/lib/brand'
import { BOTTLE_H } from '@/lib/bottleProfile'
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
import type { Quality } from '@/lib/useAppStore'
import Director from './Director'
import Lighting from './Lighting'
import Bottle from './Bottle'
import Tumbler, { GLASS_H } from './Tumbler'
import PourStream from './PourStream'
import GoldDrop from './GoldDrop'
import GodRays from './GodRays'
import Burst from './Burst'
import Plinth from './Plinth'

const GLASS_X = 0.075
/** The bottle pivots about its own middle when it tips over the glass. */
const TILT_PIVOT = BOTTLE_H * 0.5

/**
 * The whole set. Director is mounted first on purpose: R3F runs `useFrame`
 * subscribers in mount order, so the storyboard has written every value in
 * `stageState` before anything below reads it.
 */
export default function Scene({ quality }: { quality: Quality }) {
  const lagerPivot = useRef<THREE.Group>(null)
  const lagerRoot = useRef<THREE.Group>(null)
  const blackRoot = useRef<THREE.Group>(null)
  const mouthRef = useRef<THREE.Object3D>(null)
  const bgRef = useRef<THREE.Color>(new THREE.Color(BRAND.navyInk))

  const navyInk = useMemo(() => new THREE.Color(BRAND.navyInk), [])
  const barBlack = useMemo(() => new THREE.Color('#07060a'), [])
  // mutated in place every frame; the DepthOfField effect re-reads it, which
  // is what keeps the subject sharp as the camera travels from 0.16 m to 0.8 m
  const focusPoint = useMemo(() => new THREE.Vector3(0, 0.115, 0), [])

  const glassLanding: [number, number, number] = [GLASS_X, GLASS_H * 0.72, 0]

  useFrame((state) => {
    focusPoint.set(focus.x, focus.y, focus.z)
    if (lagerRoot.current) lagerRoot.current.position.x = layout.lagerX
    if (lagerPivot.current) lagerPivot.current.rotation.z = layout.tilt
    if (blackRoot.current) {
      blackRoot.current.position.x = layout.blackX
      blackRoot.current.rotation.y = layout.blackSpin
    }
    // the background is a light change, not a cut
    bgRef.current.copy(navyInk).lerp(barBlack, look.warmth)
    state.scene.background = bgRef.current
    if (state.scene.fog) {
      ;(state.scene.fog as THREE.Fog).color.copy(bgRef.current)
    }
  })

  return (
    <>
      <Director />
      <Lighting anim={look} quality={quality} />

      <fog attach="fog" args={[BRAND.navyInk, 0.45, 1.3]} />

      {/* the sunburst from the label, as a glow the hero stands in */}
      <group position={[0, 0.115, -0.05]}>
        <GodRays anim={rays} scale={0.95} />
      </group>

      {/* ── Premium Lager ────────────────────────────────────────────── */}
      <group ref={lagerRoot}>
        <group position={[0, TILT_PIVOT, 0]}>
          <group ref={lagerPivot}>
            <group position={[0, -TILT_PIVOT, 0]}>
              <Bottle beer={BEERS.lager} quality={quality} anim={lager} />
              {/* marker the pour stream hangs off as the bottle tips */}
              <object3D ref={mouthRef} position={[0, BOTTLE_H + 0.004, 0]} />
              {/* CO2 at the mouth when the crown goes */}
              <group position={[0, BOTTLE_H + 0.006, 0]}>
                <Burst
                  anim={capBurst}
                  count={quality === 'high' ? 260 : 120}
                  color="#dff0ff"
                  spread={0.035}
                  lift={0.05}
                  size={9}
                  opacity={0.5}
                />
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* gold splash where the drop lands */}
      <group position={[0, 0.004, 0]}>
        <Burst
          anim={splashBurst}
          count={quality === 'high' ? 180 : 90}
          color={BRAND.goldLight}
          spread={0.08}
          lift={0.055}
          gravity={0.07}
          size={5}
        />
      </group>

      {/* ── the glass and the pour ───────────────────────────────────── */}
      <group position={[GLASS_X, 0, 0]}>
        <Tumbler beer={BEERS.lager} quality={quality} anim={tumbler} />
      </group>
      <PourStream fromRef={mouthRef} to={glassLanding} anim={pour} color={BEERS.lager.liquid} />

      {/* ── Hanuman Black ────────────────────────────────────────────── */}
      <group ref={blackRoot}>
        <Bottle beer={BEERS.black} quality={quality} anim={black} />
      </group>

      {/* ── the drop, and the floor it finally lands on ──────────────── */}
      <GoldDrop anim={drop} />
      <Plinth anim={layout} />

      <EffectComposer enableNormalPass={false} multisampling={quality === 'high' ? 4 : 0}>
        <Bloom
          intensity={quality === 'high' ? 0.32 : 0.22}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.25}
          mipmapBlur
        />
        {quality === 'high' ? (
          <DepthOfField target={focusPoint} focalLength={0.02} bokehScale={2.4} height={512} />
        ) : (
          <></>
        )}
        <Vignette offset={0.28} darkness={0.75} />
      </EffectComposer>
    </>
  )
}
