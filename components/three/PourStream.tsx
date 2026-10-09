'use client'

import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NOISE } from './shaders/noise.glsl'

/**
 * The pour. A tapered cylinder whose surface is pushed about by noise and
 * which is clipped from the top down by `progress`, so the stream reads as
 * falling rather than appearing. A real fluid sim is the full-site job
 * (pre-baked sequence); at maquette scale a shader stream is indistinguishable
 * in motion and costs one draw call.
 */
interface Props {
  /** The bottle mouth; its world position is read every frame as it tilts. */
  fromRef: RefObject<THREE.Object3D | null>
  /** Where it lands, in world space. */
  to: [number, number, number]
  /** Live: head of the stream travelling down (0 → 1), and its opacity. */
  anim: { progress: number; opacity: number }
  color?: string
  radius?: number
}

export default function PourStream({
  fromRef,
  to,
  anim,
  color = '#d99323',
  radius = 0.0042,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uOpacity: { value: 1 },
    uColor: { value: new THREE.Color(color) },
  })

  const target = useMemo(() => new THREE.Vector3(...to), [to])
  const mouth = useRef(new THREE.Vector3())
  const dir = useRef(new THREE.Vector3())
  const DOWN = useMemo(() => new THREE.Vector3(0, -1, 0), [])

  const geo = useMemo(() => {
    // unit height, pivot at the top so progress can grow downward
    const g = new THREE.CylinderGeometry(1, 0.78, 1, 24, 60, true)
    g.translate(0, -0.5, 0)
    return g
  }, [])
  useEffect(() => () => geo.dispose(), [geo])

  const mat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.05,
      metalness: 0,
      // deliberately not transmissive: a transmissive stream forces a second
      // render-target pass every frame and, in motion, is indistinguishable
      // from a bright translucent one.
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const u = uniforms.current
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u)
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uTime; uniform float uProgress;
           varying float vT;
           ${NOISE}`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           vT = -position.y; // 0 at the mouth, 1 at the glass
           // the stream necks down and ripples as it accelerates
           float wob = (fbm(vec2(vT * 7.0, uTime * 2.2)) - 0.5) * 0.5;
           float neck = 1.0 - 0.42 * smoothstep(0.0, 0.6, vT);
           transformed.xz *= neck * (1.0 + wob * 0.25);
           transformed.x += (fbm(vec2(vT * 4.0 + 11.0, uTime * 1.7)) - 0.5) * 0.35;
           transformed.z += (fbm(vec2(vT * 4.0 + 31.0, uTime * 1.9)) - 0.5) * 0.35;`,
        )
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uProgress; uniform float uOpacity;
           varying float vT;`,
        )
        .replace(
          '#include <alphatest_fragment>',
          `#include <alphatest_fragment>
           if (vT > uProgress) discard;
           diffuseColor.a *= uOpacity * smoothstep(1.0, 0.86, vT / max(uProgress, 0.001));`,
        )
    }
    m.customProgramCacheKey = () => 'hanuman-pour'
    return m
  }, [color])

  useEffect(() => () => mat.dispose(), [mat])

  useFrame((_, dt) => {
    const u = uniforms.current
    u.uTime.value += dt
    u.uProgress.value = anim.progress
    u.uOpacity.value = anim.opacity
    const m = meshRef.current
    if (!m) return
    m.visible = anim.progress > 0.001 && anim.opacity > 0.01
    if (!m.visible || !fromRef.current) return

    fromRef.current.getWorldPosition(mouth.current)
    m.position.copy(mouth.current)
    const length = mouth.current.distanceTo(target)
    m.scale.set(radius, length, radius)
    // aim the stream at the glass
    dir.current.copy(target).sub(mouth.current).normalize()
    m.quaternion.setFromUnitVectors(DOWN, dir.current)
  })

  return <mesh ref={meshRef} geometry={geo} material={mat} />
}
