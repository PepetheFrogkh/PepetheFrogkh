'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  type BufferGeometry,
  Color,
  NormalBlending,
  NoToneMapping,
  type PerspectiveCamera,
  Plane,
  Raycaster,
  type ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
} from 'three'
import {
  AMPLITUDE,
  CAMERA,
  DESKTOP_SIDE,
  MOBILE_SIDE,
  RIPPLES,
  buildGrid,
} from './wave'
import { fragmentShader, vertexShader } from './waveShaders'

/**
 * La vague de particules.
 *
 * Une nappe de points dans le plan horizontal, dont la hauteur est calculee
 * par la carte graphique a chaque image. Trois sinusoides croisees donnent la
 * houle de fond ; le curseur y ajoute des anneaux qui s'eloignent du point
 * touche et s'eteignent ; le defilement change l'amplitude et fait descendre
 * la camera vers la nappe.
 *
 * Fond creme, points peche dans les creux et orange vif sur les cretes : la
 * charte, et rien d'autre. Le melange est normal et non additif, parce que
 * l'additif perce un trou blanc dans le creme.
 */

const PEACH = new Color('#FFE3CF')
const ORANGE = new Color('#FF6B00')

interface SceneProps {
  /** De 0 a 1 : 0 en haut de page, 1 a la fin de la section suivante. */
  progress: () => number
  side: number
  /** Image fixe : une seule hauteur, aucune boucle. */
  still: boolean
  /** Les ondes du curseur, coupees la ou il n'y a pas de souris. */
  ripples: boolean
}

const GROUND = new Plane(new Vector3(0, 1, 0), 0)
const raycaster = new Raycaster()
const hit = new Vector3()
const ndc = new Vector2()

function Wave({ progress, side, still, ripples: ripplesOn }: SceneProps) {
  const material = useRef<ShaderMaterial>(null)
  const geometry = useRef<BufferGeometry>(null)
  const positions = useMemo(() => buildGrid(side), [side])

  /** Les ondes vivantes : x, z, age, force. Une liste fixe, jamais realouee. */
  const live = useMemo(
    () => Array.from({ length: RIPPLES }, () => new Vector4(0, 0, 0, 0)),
    [],
  )
  const next = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: AMPLITUDE.from },
      uSize: { value: 0 },
      uPixelRatio: { value: 1 },
      uRipples: { value: live },
      uLow: { value: PEACH },
      uHigh: { value: ORANGE },
    }),
    [live],
  )

  const { camera, gl, size } = useThree()

  // la taille d'un point suit la densite d'affichage et la hauteur du cadre
  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(2, gl.getPixelRatio())
    uniforms.uSize.value = Math.max(16, Math.min(34, size.height / 24))
  }, [gl, size.height, uniforms])

  /**
   * Le curseur est suivi sur la fenetre, pas sur le canvas : le canvas est
   * decoratif et ne recoit aucun evenement de pointeur, sinon il volerait les
   * clics au texte pose par-dessus.
   */
  useEffect(() => {
    if (!ripplesOn || still) return
    const el = gl.domElement
    let last = 0
    const lastPoint = new Vector3(999, 0, 999)

    const onMove = (event: PointerEvent) => {
      const now = performance.now()
      if (now - last < 90) return
      const box = el.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) return
      ndc.set(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        -(((event.clientY - box.top) / box.height) * 2 - 1),
      )
      raycaster.setFromCamera(ndc, camera)
      if (!raycaster.ray.intersectPlane(GROUND, hit)) return
      // une onde seulement si le curseur a vraiment avance
      if (hit.distanceTo(lastPoint) < 0.5) return
      last = now
      lastPoint.copy(hit)

      const slot = live[next.current]
      slot.set(hit.x, hit.z, 0, 1)
      next.current = (next.current + 1) % RIPPLES
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [camera, gl, live, ripplesOn, still])

  useFrame((state, rawDelta) => {
    const delta = Math.min(0.05, rawDelta)
    const t = progress()

    if (still) {
      uniforms.uTime.value = 6.2
      uniforms.uAmplitude.value = AMPLITUDE.from
    } else {
      uniforms.uTime.value += delta
      uniforms.uAmplitude.value +=
        (AMPLITUDE.from + (AMPLITUDE.to - AMPLITUDE.from) * t - uniforms.uAmplitude.value) * 0.08

      // les ondes vieillissent et s'eteignent
      for (const r of live) {
        if (r.w <= 0) continue
        r.z += delta
        if (r.z > 2.6) r.set(0, 0, 0, 0)
      }
    }

    // la camera descend vers la nappe et s'incline
    const cam = state.camera as PerspectiveCamera
    const y = CAMERA.from.y + (CAMERA.to.y - CAMERA.from.y) * t
    const z = CAMERA.from.z + (CAMERA.to.z - CAMERA.from.z) * t
    const look = CAMERA.from.look + (CAMERA.to.look - CAMERA.from.look) * t
    cam.position.set(0, y, z)
    cam.lookAt(0, look, 0)
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        // un materiau transparent n'a rien a ecrire dans la profondeur : sans
        // cela les points se masquent entre eux selon leur ordre de dessin
        depthWrite={false}
        blending={NormalBlending}
      />
    </points>
  )
}

/** Previent la page des que la premiere image est dessinee. */
function FirstFrame({ onPainted }: { onPainted: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    onPainted()
  })
  return null
}

export default function WaveScene({
  progress,
  mobile = false,
  still = false,
  paused = false,
  onPainted,
}: {
  progress: () => number
  mobile?: boolean
  still?: boolean
  /** Hors de l'ecran : la boucle s'arrete, la carte graphique se repose. */
  paused?: boolean
  onPainted?: () => void
}) {
  const side = mobile ? MOBILE_SIDE : DESKTOP_SIDE

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, CAMERA.from.y, CAMERA.from.z], fov: CAMERA.fov, near: 0.1, far: 60 }}
      // Sans cette ligne, le tone mapping par defaut delave le peche et
      // l'orange : la charte ne serait plus respectee a l'ecran.
      gl={{ antialias: false, alpha: true, toneMapping: NoToneMapping }}
      frameloop={paused ? 'never' : still ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      {onPainted ? <FirstFrame onPainted={onPainted} /> : null}
      <Wave progress={progress} side={side} still={still} ripples={!mobile} />
    </Canvas>
  )
}
