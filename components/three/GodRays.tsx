'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BRAND } from '@/lib/brand'

/**
 * The sunburst from the label, lifted off the bottle and put behind it.
 * Additive plane, no volumetrics — at this scale a shader fan is cleaner and
 * a hundred times cheaper than a real god-ray pass.
 */
interface Props {
  /** Live intensity, read every frame. */
  anim: { intensity: number }
  color?: string
  scale?: number
  spin?: number
}

export default function GodRays({
  anim,
  color = BRAND.gold,
  scale = 0.9,
  spin = 0.035,
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color],
  )

  const spun = useRef(0)

  useFrame((state, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += dt
      matRef.current.uniforms.uIntensity.value = anim.intensity
    }
    const m = meshRef.current
    if (m) {
      m.visible = anim.intensity > 0.01
      // always square to the camera, so the burst stays centred behind the
      // bottle through a full 360° orbit instead of sliding off to one side
      spun.current += dt * spin
      m.quaternion.copy(state.camera.quaternion)
      m.rotateZ(spun.current)
    }
  })

  return (
    <mesh ref={meshRef} scale={scale} renderOrder={-1} visible={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          varying vec2 vP;
          void main(){
            vP = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime; uniform float uIntensity; uniform vec3 uColor;
          varying vec2 vP;
          void main(){
            float r = length(vP) * 2.0;
            float a = atan(vP.y, vP.x);
            // 28 rays, alternating long and short, as on the packaging
            float rays = 0.5 + 0.5 * cos(a * 20.0 + sin(uTime * 0.2) * 0.3);
            rays = pow(rays, 4.0) * 0.5 + 0.5 * pow(0.5 + 0.5 * cos(a * 10.0), 8.0);
            // soft at the centre, gone by the edge: a glow the bottle sits in,
            // not a graphic the bottle sits on
            float falloff = smoothstep(1.0, 0.1, r) * smoothstep(0.0, 0.22, r);
            float core = smoothstep(0.55, 0.0, r);
            float v = (rays * falloff * 0.16 + core * 0.2) * uIntensity;
            if (v < 0.0015) discard;
            gl_FragColor = vec4(uColor * v, v);
            #include <colorspace_fragment>
          }
        `}
      />
    </mesh>
  )
}
