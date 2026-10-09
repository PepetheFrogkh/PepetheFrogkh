'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BRAND } from '@/lib/brand'

/**
 * The dark reflective floor the line-up stands on at the end. It only exists
 * for the last plan, so it fades up with `anim.plinth` and costs nothing
 * before that.
 */
export default function Plinth({ anim }: { anim: { plinth: number } }) {
  const ref = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)

  const geo = useMemo(() => new THREE.CircleGeometry(0.42, 72), [])
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.14, 0.145, 96), [])

  useFrame((_, dt) => {
    const v = anim.plinth
    if (ref.current) ref.current.visible = v > 0.01
    if (matRef.current) matRef.current.opacity = v
    if (ringMat.current) ringMat.current.opacity = v * 0.5
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.08
  })

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0005, 0]}>
      <mesh ref={ref} geometry={geo} receiveShadow visible={false}>
        <meshPhysicalMaterial
          ref={matRef}
          color={BRAND.navyInk}
          roughness={0.12}
          metalness={0.6}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={ringRef} geometry={ringGeo} position={[0, 0, 0.0004]}>
        <meshBasicMaterial
          ref={ringMat}
          color={BRAND.gold}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
