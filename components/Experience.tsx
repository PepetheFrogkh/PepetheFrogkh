'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import * as THREE from 'three'
import Scene from './three/Scene'
import { useApp } from '@/lib/useAppStore'

/**
 * One persistent <Canvas> for the whole page, as the brief requires. Scenes
 * are groups inside it that fade in and out — nothing is ever unmounted and
 * remounted, so there is no hitch between plans.
 */
export default function Experience() {
  const quality = useApp((s) => s.quality)
  const setQuality = useApp((s) => s.setQuality)
  const setWebgl = useApp((s) => s.setWebgl)
  const setLoaded = useApp((s) => s.setLoaded)
  const reduced = useApp((s) => s.reducedMotion)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // feature + capability detection, once
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) {
      setWebgl(false)
      return
    }
    const mobile = window.matchMedia('(pointer: coarse)').matches
    const small = Math.min(window.innerWidth, window.innerHeight) < 700
    const cores = navigator.hardwareConcurrency ?? 4
    setQuality(mobile || small || cores <= 4 ? 'low' : 'high')
    setReady(true)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }, [setQuality, setWebgl])

  if (!ready || reduced) return null

  return (
    <div className="canvas-layer" aria-hidden="true">
      <Canvas
        dpr={quality === 'high' ? [1, 1.8] : [1, 1.4]}
        gl={{
          antialias: false, // the composer does MSAA; this just costs memory
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 34, near: 0.01, far: 12, position: [0, 0.3, 0.46] }}
        shadows={quality === 'high'}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
          setLoaded(true)
        }}
      >
        <Scene quality={quality} />
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
        <Preload all />
      </Canvas>
    </div>
  )
}
