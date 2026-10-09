'use client'

import { forwardRef, useEffect, useMemo, useRef, type Ref, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  bottleGeometry,
  radiusAt,
  LABEL_BAND,
  COLLAR_BAND,
  BOTTLE_H,
  BOTTLE_RADIUS,
} from '@/lib/bottleProfile'
import type { Beer } from '@/lib/brand'
import { BRAND } from '@/lib/brand'
import {
  makeCondensationUniforms,
  patchCondensation,
  type CondensationUniforms,
} from './shaders/condensation'
import { useLabelTextures } from './useLabelTextures'
import type { Quality } from '@/lib/useAppStore'

/**
 * Live, mutated by the Director every frame. Never a React prop — see
 * `lib/stageState.ts`.
 */
export interface BottleAnim {
  /** 0 → 1 condensation reveal. */
  frost: number
  /** How far the droplets have run. */
  drip: number
  /** Cap lift in metres; > 0 pops the crown off. */
  capLift: number
  capSpin: number
  /** 1 = full, 0 = empty — the beer still in the bottle. */
  fill: number
  opacity: number
}

interface Props {
  beer: Beer
  quality: Quality
  anim: BottleAnim
}

const BAND_SEGMENTS = 96

/**
 * The bottle is built as a lathe of revolution from the measured packshot
 * profile, with the label and the neck foil as their own thin cylinders
 * sleeved over it — exactly how the real object is assembled, and the only way
 * to keep transmissive glass behind a crisp label.
 */
const Bottle = forwardRef<THREE.Group, Props>(function Bottle({ beer, quality, anim }, ref) {
  const segments = quality === 'high' ? BAND_SEGMENTS : 48
  const { label, collar } = useLabelTextures(beer)
  const condRef = useRef<CondensationUniforms>(makeCondensationUniforms())
  const liquidRef = useRef<THREE.Mesh>(null)
  const capRef = useRef<THREE.Group>(null)

  const glassGeo = useMemo(() => bottleGeometry({ segments }), [segments])

  const liquidGeo = useMemo(
    () => bottleGeometry({ segments, inset: 0.0016, topFraction: 0.72 }),
    [segments],
  )

  const glassMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(beer.glass),
      roughness: 0.06,
      metalness: 0,
      transmission: 1,
      thickness: beer.id === 'black' ? 0.05 : 0.022,
      ior: 1.52,
      attenuationColor: new THREE.Color(beer.glass),
      attenuationDistance: beer.id === 'black' ? 0.012 : 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      side: THREE.DoubleSide,
      envMapIntensity: 1.4,
    })
    patchCondensation(m, condRef.current)
    return m
  }, [beer])

  const liquidMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(beer.liquid),
        roughness: 0.1,
        metalness: 0,
        transmission: beer.id === 'black' ? 0.12 : 0.55,
        thickness: 0.05,
        ior: 1.33,
        attenuationColor: new THREE.Color(beer.liquid),
        attenuationDistance: beer.id === 'black' ? 0.008 : 0.04,
        emissive: new THREE.Color(beer.liquid),
        emissiveIntensity: beer.id === 'black' ? 0.05 : 0.2,
        envMapIntensity: 1.2,
      }),
    [beer],
  )

  useEffect(() => () => {
    glassGeo.dispose()
    liquidGeo.dispose()
    glassMat.dispose()
    liquidMat.dispose()
  }, [glassGeo, liquidGeo, glassMat, liquidMat])

  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const u = condRef.current
    u.uTime.value += dt
    u.uReveal.value = anim.frost
    u.uDrip.value = anim.drip

    const g = groupRef.current
    if (g) {
      g.visible = anim.opacity > 0.01
      // transmissive glass does not fade gracefully, so the bottle scales and
      // sinks out of frame instead of dissolving
      const o = anim.opacity
      g.scale.setScalar(0.9 + o * 0.1)
      g.position.y = (1 - o) * -0.05
    }
    if (liquidRef.current) liquidRef.current.scale.y = Math.max(0.001, anim.fill)
    if (capRef.current) {
      capRef.current.position.y = BOTTLE_H + anim.capLift
      capRef.current.rotation.z = anim.capSpin
      capRef.current.rotation.x = anim.capSpin * 0.6
      capRef.current.visible = anim.capLift < 0.5
    }
  })

  // label geometry: an open cylinder hugging the body band
  const labelGeo = useMemo(() => {
    const [a, b] = LABEL_BAND
    const h = (b - a) * BOTTLE_H
    const r = radiusAt((a + b) / 2) + 0.00035
    const g = new THREE.CylinderGeometry(r, r, h, segments, 1, true)
    g.translate(0, (a + b) / 2 * BOTTLE_H, 0)
    return g
  }, [segments])

  const collarGeo = useMemo(() => {
    const [a, b] = COLLAR_BAND
    const h = (b - a) * BOTTLE_H
    const rTop = radiusAt(b) + 0.0004
    const rBot = radiusAt(a) + 0.0004
    const g = new THREE.CylinderGeometry(rTop, rBot, h, segments, 1, true)
    g.translate(0, (a + b) / 2 * BOTTLE_H, 0)
    return g
  }, [segments])

  useEffect(() => () => {
    labelGeo.dispose()
    collarGeo.dispose()
  }, [labelGeo, collarGeo])

  const crownR = radiusAt(0.99) + 0.0012

  return (
    <group ref={mergeRefs(ref, groupRef)}>
      {/* beer inside the glass */}
      <mesh ref={liquidRef} geometry={liquidGeo} material={liquidMat} />

      {/* the glass itself */}
      <mesh geometry={glassGeo} material={glassMat} castShadow receiveShadow />

      {/* paper label */}
      {label && (
        <mesh geometry={labelGeo}>
          <meshPhysicalMaterial
            map={label}
            roughness={0.55}
            metalness={0.08}
            clearcoat={0.25}
            clearcoatRoughness={0.4}
            side={THREE.DoubleSide}
            envMapIntensity={0.9}
          />
        </mesh>
      )}

      {/* neck foil */}
      {collar && (
        <mesh geometry={collarGeo}>
          <meshStandardMaterial
            map={collar}
            roughness={0.28}
            metalness={0.85}
            side={THREE.DoubleSide}
            envMapIntensity={1.5}
          />
        </mesh>
      )}

      {/* crown cap */}
      <group ref={capRef} position={[0, BOTTLE_H, 0]}>
        <mesh position={[0, 0.0045, 0]}>
          <cylinderGeometry args={[crownR, crownR, 0.009, 24, 1]} />
          <meshStandardMaterial
            color={beer.id === 'black' ? BRAND.gold : BRAND.navy}
            roughness={0.3}
            metalness={0.9}
            envMapIntensity={1.4}
          />
        </mesh>
        <mesh position={[0, 0.0025, 0]}>
          <torusGeometry args={[crownR, 0.0014, 6, 24]} />
          <meshStandardMaterial
            color={beer.id === 'black' ? BRAND.goldDeep : BRAND.navyDeep}
            roughness={0.35}
            metalness={0.9}
          />
        </mesh>
      </group>
    </group>
  )
})

/** Lets the caller keep a ref while the component keeps its own. */
function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T) => {
    for (const r of refs) {
      if (typeof r === 'function') r(value)
      else if (r && typeof r === 'object') (r as MutableRefObject<T>).current = value
    }
  }
}

export default Bottle
export { BOTTLE_H, BOTTLE_RADIUS }
