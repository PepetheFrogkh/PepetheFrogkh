'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { BRAND, } from '@/lib/brand'
import { scroll, damp, mix } from '@/lib/scrollState'

/**
 * The studio is built out of Lightformers rather than a downloaded HDRI: the
 * long soft strips either side are exactly what a beer photographer rigs to
 * draw two bright edges down a bottle, and generating the probe in-engine
 * keeps the scene offline and inside the asset budget.
 *
 * `anim.warmth` crossfades the rig from the Lager's bright warm key to Black's
 * lower, bar-lit setup. It is read per frame, so the transition in plan 6 is
 * a light change, not a cut.
 */
interface Props {
  /** Live 0 (Lager) → 1 (Black). */
  anim: { warmth: number }
  quality: 'high' | 'low'
}

export default function Lighting({ anim, quality }: Props) {
  const keyRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const kickRef = useRef<THREE.SpotLight>(null)
  const rigRef = useRef<THREE.Group>(null)
  const sideA = useRef<THREE.Mesh>(null)
  const sideB = useRef<THREE.Mesh>(null)
  const topRef = useRef<THREE.Mesh>(null)
  const fillRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const parallax = useRef(0)

  const warmKey = new THREE.Color(BRAND.goldLight)
  const coolKey = new THREE.Color('#fff4e0')
  const tmp = new THREE.Color()

  useFrame((_, dt) => {
    const w = anim.warmth
    const dim = 1 - w * 0.55

    // the cursor nudges the rig, so reflections slide across the glass
    parallax.current = damp(parallax.current, scroll.pointerX, 3, dt)
    if (rigRef.current) {
      rigRef.current.rotation.y = parallax.current * 0.22
      rigRef.current.rotation.x = scroll.pointerY * 0.06
    }

    if (keyRef.current) {
      keyRef.current.position.x = 0.35 + parallax.current * 0.25
      keyRef.current.intensity = 2.6 * dim
      keyRef.current.color.copy(tmp.copy(coolKey).lerp(warmKey, w))
    }
    if (ambientRef.current) ambientRef.current.intensity = mix(0.3, 0.08, w)
    if (kickRef.current) kickRef.current.intensity = mix(2.2, 3.4, w)

    // Lightformer meshes expose their intensity through the material colour
    const set = (o: THREE.Mesh | null, v: number) => {
      const m = o?.material as (THREE.Material & { intensity?: number }) | undefined
      if (m && 'intensity' in m) m.intensity = v
    }
    set(sideA.current, 6 * dim)
    set(sideB.current, 4.5 * dim)
    set(topRef.current, mix(3, 5, w))
    set(fillRef.current, mix(1.1, 0.3, w))
    set(ringRef.current, mix(1.6, 4, w))
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.3} />

      <directionalLight
        ref={keyRef}
        position={[0.35, 0.6, 0.45]}
        intensity={2.6}
        color="#fff4e0"
        castShadow={quality === 'high'}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.05}
        shadow-camera-far={2}
        shadow-camera-left={-0.3}
        shadow-camera-right={0.3}
        shadow-camera-top={0.4}
        shadow-camera-bottom={-0.3}
        shadow-bias={-0.0008}
      />

      {/* gold kicker from behind — the label's sunburst, turned into light */}
      <spotLight
        ref={kickRef}
        position={[-0.3, 0.35, -0.5]}
        angle={0.9}
        penumbra={1}
        intensity={2.2}
        color={BRAND.gold}
      />

      <group ref={rigRef}>
        <Environment resolution={quality === 'high' ? 256 : 128} frames={Infinity}>
          {/* the two vertical strips that draw the bottle's edges */}
          <Lightformer
            ref={sideA}
            form="rect"
            intensity={6}
            color="#fff6e8"
            position={[-2.2, 0.4, 1.2]}
            scale={[0.4, 4, 1]}
            target={[0, 0, 0]}
          />
          <Lightformer
            ref={sideB}
            form="rect"
            intensity={4.5}
            color="#e9f2ff"
            position={[2.4, 0.3, 0.8]}
            scale={[0.3, 4, 1]}
            target={[0, 0, 0]}
          />
          {/* warm top bounce */}
          <Lightformer
            ref={topRef}
            form="rect"
            intensity={3}
            color={BRAND.goldLight}
            position={[0, 3, 0.6]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[3, 3, 1]}
          />
          {/* brand navy fill, so the shadows are never neutral grey */}
          <Lightformer
            ref={fillRef}
            form="rect"
            intensity={1.1}
            color={BRAND.navy}
            position={[0, -1.6, -1.4]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[5, 5, 1]}
          />
          <Lightformer
            ref={ringRef}
            form="ring"
            intensity={1.6}
            color={BRAND.gold}
            position={[0, 0.2, -2.4]}
            scale={[2.5, 2.5, 1]}
          />
        </Environment>
      </group>
    </>
  )
}
