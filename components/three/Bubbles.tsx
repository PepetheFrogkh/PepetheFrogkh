'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Carbonation. Points rather than instanced spheres: at this size a bubble is
 * two or three pixels, and a shaded sprite with a rim highlight is both
 * cheaper and more convincing than real geometry.
 */
interface Props {
  count: number
  radius: number
  height: number
  /** Live column height in metres, read every frame. */
  anim?: { height: number }
  color?: string
  speed?: number
  /** Bubble diameter in metres — real carbonation is 0.3–1 mm. */
  size?: number
  opacity?: number
}

export default function Bubbles({
  count,
  radius,
  height,
  anim,
  color = '#fff6df',
  speed = 1,
  size = 0.0007,
  opacity = 0.85,
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // stratified in a disc so the column looks evenly carbonated
      const a = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random()) * radius
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = Math.random()
      pos[i * 3 + 2] = Math.sin(a) * r
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count, radius])

  useEffect(() => () => geo.dispose(), [geo])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeight: { value: height },
      uColor: { value: new THREE.Color(color) },
      uSize: { value: size },
      uSpeed: { value: speed },
      uOpacity: { value: opacity },
      /** px per metre at one metre — rebuilt from the live projection. */
      uProject: { value: 1 },
    }),
    [height, color, size, speed, opacity],
  )

  useFrame((state, dt) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value += dt
    if (anim) matRef.current.uniforms.uHeight.value = anim.height
    // pointSize(px) = worldSize · P[1][1] · drawingBufferHeight / 2 / -viewZ
    matRef.current.uniforms.uProject.value =
      (state.camera.projectionMatrix.elements[5] * state.size.height * state.viewport.dpr) / 2
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform float uHeight;
          uniform float uSize;
          uniform float uSpeed;
          uniform float uProject;
          varying float vFade;
          varying float vSeed;
          void main(){
            vSeed = aSeed;
            float rise = fract(position.y + uTime * uSpeed * (0.18 + aSeed * 0.3));
            float y = rise * uHeight;
            // bubbles accelerate and drift as they climb
            float sway = sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 31.0) * 0.0016 * rise;
            vec3 p = vec3(position.x + sway, y, position.z + sway * 0.7);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            // bubbles nucleate small and expand as the pressure drops
            float grow = 0.45 + rise * 0.9 + aSeed * 0.6;
            gl_PointSize = clamp(uSize * grow * uProject / max(-mv.z, 0.01), 1.0, 24.0);
            // fade in at the bottom, pop at the surface
            vFade = smoothstep(0.0, 0.12, rise) * (1.0 - smoothstep(0.88, 1.0, rise));
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vFade;
          varying float vSeed;
          void main(){
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float rim = smoothstep(0.5, 0.33, d) * 0.35;
            float spec = smoothstep(0.22, 0.0, length(c - vec2(-0.14, 0.14)));
            float a = (rim + spec * 0.9) * vFade * uOpacity;
            gl_FragColor = vec4(uColor + spec * 0.6, a);
            #include <colorspace_fragment>
          }
        `}
      />
    </points>
  )
}
