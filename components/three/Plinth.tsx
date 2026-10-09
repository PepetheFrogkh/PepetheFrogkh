'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BRAND } from '@/lib/brand'

/**
 * The dark reflective floor the line-up stands on at the end.
 *
 * Its alpha is baked into the vertex colours so the disc fades out before it
 * reaches an edge — a hard-edged circle of mirror reads as a prop, and a
 * polished slab this size catches the key light as one hot blob. It only
 * exists for the last plan, so it costs nothing before that.
 */
const RADIUS = 0.2

function fadedDisc() {
  const g = new THREE.CircleGeometry(RADIUS, 96)
  const count = g.attributes.position.count
  const colors = new Float32Array(count * 4)
  const pos = g.attributes.position
  for (let i = 0; i < count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getY(i)) / RADIUS
    const a = 1 - r * r // falls away quickly, so the rim is never a line
    colors.set([1, 1, 1, a], i * 4)
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 4))
  return g
}

export default function Plinth({ anim }: { anim: { plinth: number } }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)

  const geo = useMemo(fadedDisc, [])
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.125, 0.129, 96), [])
  useEffect(() => () => {
    geo.dispose()
    ringGeo.dispose()
  }, [geo, ringGeo])

  useFrame((_, dt) => {
    const v = anim.plinth
    if (groupRef.current) groupRef.current.visible = v > 0.01
    if (matRef.current) matRef.current.opacity = v * 0.9
    if (ringMat.current) ringMat.current.opacity = v * 0.45
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.08
  })

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0005, 0]} visible={false}>
      <mesh geometry={geo} receiveShadow>
        <meshPhysicalMaterial
          ref={matRef}
          color={BRAND.navyInk}
          roughness={0.34}
          metalness={0.4}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ringRef} geometry={ringGeo} position={[0, 0, 0.0004]}>
        <meshBasicMaterial
          ref={ringMat}
          color={BRAND.gold}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
