'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NOISE } from './shaders/noise.glsl'

/**
 * The head. A cylinder whose cap is pushed around by noise in the vertex
 * shader and whose surface is broken up by a bubble field in the fragment
 * shader. Physical material with sheen and a little transmission is what makes
 * it read as wet foam rather than polystyrene.
 *
 * The mesh is a unit-height cylinder scaled on Y, so the vertex displacement
 * divides its Y component back out — otherwise a 20 mm head would flatten the
 * dome by the same factor.
 */
interface Props {
  radius: number
  /** Live: metres of head, and the base it sits on. Read every frame. */
  anim: { height: number; y: number }
  color?: string
  /** Fine and dense for Black, coarser for Lager. */
  bead?: number
}

export default function Foam({ radius, anim, color = '#f7edd8', bead = 44 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useRef({
    uTime: { value: 0 },
    uAmp: { value: 0.0024 },
    uBead: { value: bead },
    uYScale: { value: 0.02 },
  })

  const geo = useMemo(
    () => new THREE.CylinderGeometry(radius, radius * 0.985, 1, 72, 20, false),
    [radius],
  )
  useEffect(() => () => geo.dispose(), [geo])

  const mat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.92,
      metalness: 0,
      transmission: 0.12,
      thickness: 0.01,
      sheen: 1,
      sheenRoughness: 0.9,
      sheenColor: new THREE.Color('#ffffff'),
      clearcoat: 0.2,
      clearcoatRoughness: 0.8,
    })
    const u = uniforms.current
    const R = radius.toFixed(5)
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u)
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uTime; uniform float uAmp; uniform float uYScale;
           varying vec3 vFoamPos;
           ${NOISE}`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           vFoamPos = position;
           float top = smoothstep(0.2, 0.5, position.y);
           float n = fbm(position.xz * 260.0 + uTime * 0.25) - 0.5;
           float crown = 1.0 - smoothstep(0.5, 1.0, length(position.xz) / ${R});
           vec3 disp = normal * (n * uAmp + crown * uAmp * 1.5) * top;
           disp.y /= max(uYScale, 0.0005);
           transformed += disp;`,
        )
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uTime; uniform float uBead;
           varying vec3 vFoamPos;
           ${NOISE}`,
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
           float bubbles = fbm(vFoamPos.xz * uBead * 14.0 + vFoamPos.y * 60.0);
           roughnessFactor = clamp(roughnessFactor - bubbles * 0.25, 0.4, 1.0);`,
        )
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>
           {
             float h = fbm(vFoamPos.xz * uBead * 20.0 + vFoamPos.y * 80.0);
             vec3 dpx = dFdx(-vViewPosition);
             vec3 dpy = dFdy(-vViewPosition);
             float dhx = dFdx(h), dhy = dFdy(h);
             vec3 nn = normalize(normal);
             vec3 r1 = cross(dpy, nn), r2 = cross(nn, dpx);
             float det = dot(dpx, r1);
             vec3 surf = sign(det) * (dhx * r1 + dhy * r2);
             normal = normalize(abs(det) * nn - 2.2 * surf);
           }`,
        )
    }
    m.customProgramCacheKey = () => 'hanuman-foam'
    return m
  }, [color, radius])

  useEffect(() => () => mat.dispose(), [mat])

  useFrame((_, dt) => {
    const u = uniforms.current
    u.uTime.value += dt
    u.uBead.value = bead
    const h = anim.height
    u.uYScale.value = Math.max(h, 0.0005)
    const m = meshRef.current
    if (m) {
      m.scale.y = Math.max(0.0005, h)
      m.position.y = anim.y + h / 2
      m.visible = h > 0.0008
    }
  })

  return <mesh ref={meshRef} geometry={geo} material={mat} />
}
