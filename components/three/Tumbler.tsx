'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Bubbles from './Bubbles'
import Foam from './Foam'
import type { Beer } from '@/lib/brand'
import type { Quality } from '@/lib/useAppStore'

/** A straight-sided Cambodian beer-hall tumbler: 72 mm tall, 62 mm across. */
export const GLASS_H = 0.115
export const GLASS_R = 0.032
const WALL = 0.0022

function tumblerPoints() {
  const p: THREE.Vector2[] = []
  const push = (r: number, y: number) => p.push(new THREE.Vector2(r, y))
  push(0, 0)
  push(GLASS_R * 0.93, 0)
  push(GLASS_R * 0.96, 0.0025) // chamfered foot
  push(GLASS_R * 0.975, 0.02)
  push(GLASS_R * 0.99, 0.06)
  push(GLASS_R, GLASS_H - 0.006)
  push(GLASS_R, GLASS_H)
  push(GLASS_R - WALL, GLASS_H) // rim
  push(GLASS_R - WALL, GLASS_H - 0.006)
  push(GLASS_R * 0.99 - WALL, 0.06)
  push(GLASS_R * 0.975 - WALL, 0.02)
  push(GLASS_R * 0.96 - WALL, 0.014)
  push(GLASS_R * 0.7, 0.012) // the thick base, seen through the beer
  push(0, 0.014)
  return p
}

export interface TumblerAnim {
  /** 0 → 1 of the usable inner height. */
  fill: number
  /** Head height in metres. */
  foam: number
  opacity: number
}

interface Props {
  beer: Beer
  quality: Quality
  anim: TumblerAnim
}

export default function Tumbler({ beer, quality, anim }: Props) {
  const segments = quality === 'high' ? 96 : 48
  const liquidRef = useRef<THREE.Mesh>(null)

  const glassGeo = useMemo(() => {
    const g = new THREE.LatheGeometry(tumblerPoints(), segments)
    g.computeVertexNormals()
    return g
  }, [segments])

  const liquidGeo = useMemo(() => {
    // unit-height cylinder; scaled on Y by the fill level
    const g = new THREE.CylinderGeometry(GLASS_R - WALL - 0.0017, GLASS_R * 0.96 - WALL, 1, segments, 1)
    g.translate(0, 0.5, 0)
    return g
  }, [segments])

  useEffect(() => () => {
    glassGeo.dispose()
    liquidGeo.dispose()
  }, [glassGeo, liquidGeo])

  const innerH = GLASS_H - 0.014 - 0.004

  // live values the children read; recomputed once per frame below
  const column = useRef({ height: 0 })
  const foamAnim = useRef({ height: 0, y: 0.014 })
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const liquidH = innerH * anim.fill
    column.current.height = liquidH
    foamAnim.current.height = anim.foam
    foamAnim.current.y = 0.014 + liquidH
    if (groupRef.current) groupRef.current.visible = anim.opacity > 0.01
    const m = liquidRef.current
    if (!m) return
    m.scale.y = Math.max(0.0004, liquidH)
    m.visible = liquidH > 0.0005
  })

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={liquidRef} geometry={liquidGeo} position={[0, 0.014, 0]}>
        {/* Opaque on purpose. three renders transmissive materials into a
            target that excludes every other transmissive object, so a
            transmissive beer inside a transmissive glass is invisible through
            it. Making the beer opaque — colour, a little emissive lift,
            low roughness — puts it back in the glass's refraction and is what
            every product render does anyway. */}
        <meshPhysicalMaterial
          color={beer.liquid}
          roughness={0.08}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.06}
          emissive={new THREE.Color(beer.liquid)}
          emissiveIntensity={beer.id === 'black' ? 0.04 : 0.16}
          envMapIntensity={2.4}
        />
      </mesh>

      <group position={[0, 0.014, 0]}>
        <Bubbles
          count={quality === 'high' ? 1400 : 500}
          // just outside the beer, just inside the glass
          radius={GLASS_R - WALL - 0.0008}
          height={innerH}
          anim={column.current}
          color={beer.id === 'black' ? '#e8d4ad' : '#fff6df'}
          speed={beer.id === 'black' ? 0.7 : 1.1}
          size={beer.id === 'black' ? 0.0006 : 0.0009}
        />
      </group>

      <Foam
        radius={GLASS_R - WALL - 0.0004}
        anim={foamAnim.current}
        color={beer.foam}
        bead={beer.id === 'black' ? 46 : 30}
      />

      <mesh geometry={glassGeo}>
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.015}
          metalness={0}
          transmission={1}
          thickness={0.004}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0.02}
          side={THREE.DoubleSide}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  )
}
