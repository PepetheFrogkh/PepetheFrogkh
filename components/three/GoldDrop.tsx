'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BRAND } from '@/lib/brand'

/**
 * The brand's drop, as a solid of revolution of the classic teardrop curve
 * (r = sinθ · sin(θ/2)). It already exists in the identity, so it is what
 * carries every transition in the scroll: it falls to open plan 1, returns
 * black to hand over to plan 6, and settles between the bottles at the end.
 *
 * Deliberately not a Meshy asset: a generated blob cannot hold a silhouette
 * while it stretches and squashes, and this one is four lines of maths.
 */
function teardropGeometry(segments: number) {
  const pts: THREE.Vector2[] = []
  const N = 56
  for (let i = 0; i <= N; i++) {
    // θ = π at the round bottom, 0 at the point
    const th = Math.PI * (1 - i / N)
    const r = Math.sin(th) * Math.sin(th / 2)
    const y = -Math.cos(th)
    pts.push(new THREE.Vector2(Math.max(r * 0.78, 0), y * 0.62 + 0.62))
  }
  const g = new THREE.LatheGeometry(pts, segments)
  g.computeVertexNormals()
  return g
}

interface Props {
  /** Live: height in metres, size, vertical squash, and gold→black mix. */
  anim: { y: number; scale: number; squash: number; dark: number }
  segments?: number
  /** Metres at scale 1 — the drop is about 2 cm tall in hero framing. */
  size?: number
}

export default function GoldDrop({ anim, segments = 64, size = 0.026 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null)

  const geo = useMemo(() => teardropGeometry(segments), [segments])
  useEffect(() => () => geo.dispose(), [geo])

  const gold = useMemo(() => new THREE.Color(BRAND.gold), [])
  const inky = useMemo(() => new THREE.Color('#1c1206'), [])

  useFrame((_, dt) => {
    const m = meshRef.current
    if (!m) return
    const s = anim.scale * size
    m.visible = s > 0.0002
    if (!m.visible) return
    m.position.y = anim.y
    // a falling drop stretches; squash conserves volume on impact
    const sq = anim.squash
    m.scale.set((s / Math.sqrt(sq)) * 1.0, s * sq, (s / Math.sqrt(sq)) * 1.0)
    m.rotation.y += dt * 0.6
    if (matRef.current) {
      matRef.current.color.copy(gold).lerp(inky, anim.dark)
      matRef.current.roughness = 0.12 + anim.dark * 0.1
    }
  })

  return (
    <mesh ref={meshRef} geometry={geo} visible={false}>
      <meshPhysicalMaterial
        ref={matRef}
        color={BRAND.gold}
        metalness={1}
        roughness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.08}
        envMapIntensity={2.2}
      />
    </mesh>
  )
}
