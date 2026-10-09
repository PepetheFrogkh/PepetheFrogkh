'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Two one-shot particle bursts share this component: the CO2 puff when the
 * crown comes off (plan 3) and the gold splash when the drop lands (plan 1).
 * `t` is scrubbed by the scroll rather than ticked by a clock, so the burst
 * plays backwards cleanly when the user scrolls back up.
 */
interface Props {
  /** Live 0 → 1 life of the burst, scrubbed by scroll. */
  anim: { t: number }
  count?: number
  color?: string
  /** Metres per unit of t. */
  spread?: number
  lift?: number
  /** Particle diameter in metres. */
  size?: number
  /** Gravity pulling the particles back down (splash) or 0 (vapour). */
  gravity?: number
  opacity?: number
}

export default function Burst({
  anim,
  count = 220,
  color = '#ffffff',
  spread = 0.05,
  lift = 0.03,
  size = 0.0016,
  gravity = 0,
  opacity = 1,
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const dir = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // cosine-weighted hemisphere, biased outward and up
      const a = Math.random() * Math.PI * 2
      const u = Math.random()
      const rise = Math.pow(Math.random(), 1.6)
      const r = Math.sqrt(u)
      dir[i * 3] = Math.cos(a) * r
      dir[i * 3 + 1] = rise
      dir[i * 3 + 2] = Math.sin(a) * r
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(dir, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1)
    return g
  }, [count])

  useEffect(() => () => geo.dispose(), [geo])

  const uniforms = useMemo(
    () => ({
      uT: { value: 0 },
      uSpread: { value: spread },
      uLift: { value: lift },
      uSize: { value: size },
      uGravity: { value: gravity },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uProject: { value: 1 },
    }),
    [spread, lift, size, gravity, color, opacity],
  )

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) pointsRef.current.visible = anim.t > 0.001 && anim.t < 0.999
    if (!matRef.current) return
    matRef.current.uniforms.uT.value = anim.t
    matRef.current.uniforms.uProject.value =
      (state.camera.projectionMatrix.elements[5] * state.size.height * state.viewport.dpr) / 2
  })

  return (
    <points ref={pointsRef} geometry={geo} frustumCulled={false} visible={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uT, uSpread, uLift, uSize, uGravity, uProject;
          varying float vFade;
          void main(){
            float t = uT * (0.65 + aSeed * 0.7);
            float e = 1.0 - pow(1.0 - clamp(t, 0.0, 1.0), 2.4); // ease out
            vec3 p = position * uSpread * e;
            p.y += uLift * e - uGravity * t * t;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp(
              uSize * (0.4 + aSeed) * (1.0 + e * 1.8) * uProject / max(-mv.z, 0.01),
              1.0, 64.0);
            vFade = smoothstep(0.0, 0.08, uT) * (1.0 - smoothstep(0.55, 1.0, t));
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor; uniform float uOpacity;
          varying float vFade;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d) * vFade * uOpacity;
            gl_FragColor = vec4(uColor * a, a);
            #include <colorspace_fragment>
          }
        `}
      />
    </points>
  )
}
