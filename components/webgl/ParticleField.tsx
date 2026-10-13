'use client'

import { useEffect, useRef } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  WebGLRenderer,
} from 'three'
import { FRAGMENT, VERTEX } from './shaders'

/**
 * Le champ de particules de l'en-tete, en WebGL.
 *
 * Le cahier : 15 000 a 30 000 particules calculees par la carte graphique,
 * dans les couleurs de la charte ; la ceinture de Kuiper autour d'un soleil
 * orange, en rotation lente, animee d'un bruit qui la fait respirer ; la
 * souris agit comme une gravite ; au clic une onde de choc disperse la
 * ceinture, qui se reforme en une seconde ; au defilement les particules
 * quittent leur orbite pour dessiner le cadre des ecrans de la section
 * suivante. Sur mobile, 5 000 particules et le doigt a la place de la souris.
 *
 * Tout le calcul est dans le vertex shader (`shaders.ts`) : la boucle de rendu
 * ne pousse que le temps, le curseur, l'onde et la morphologie.
 */

const DESKTOP_COUNT = 20_000
const MOBILE_COUNT = 5_000
const TILT = (-18 * Math.PI) / 180
const DPR_CAP = 2

/** 60 % orange vif, 25 % orange terre, 15 % bleu-gris clair. */
const PALETTE = [
  { color: new Color('#ff6b00'), share: 0.6 },
  { color: new Color('#c2410c'), share: 0.25 },
  { color: new Color('#8a97ab'), share: 0.15 },
]

function pick(r: number): Color {
  let acc = 0
  for (const entry of PALETTE) {
    acc += entry.share
    if (r < acc) return entry.color
  }
  return PALETTE[0].color
}

/**
 * La cible de chaque particule quand la ceinture se reorganise : un point sur
 * le contour d'un des trois cadres d'ecrans de la section Realisations, posés
 * en eventail comme les cartes qui suivent.
 */
function frameTarget(i: number, total: number): [number, number, number] {
  const FRAMES = [
    { x: -0.78, y: -0.04, w: 0.44, h: 0.62, tilt: -0.09 },
    { x: 0.0, y: 0.03, w: 0.46, h: 0.66, tilt: 0.0 },
    { x: 0.78, y: -0.04, w: 0.44, h: 0.62, tilt: 0.09 },
  ]
  const frame = FRAMES[i % FRAMES.length]
  // la position le long du perimetre, repartie regulierement : l'indice dans
  // son propre cadre, divise par le nombre de particules de ce cadre
  const perFrame = Math.max(1, Math.floor(total / FRAMES.length))
  const t = (Math.floor(i / FRAMES.length) % perFrame) / perFrame
  const half = { w: frame.w / 2, h: frame.h / 2 }
  const perimeter = 2 * (frame.w + frame.h)
  let d = t * perimeter
  let lx = 0
  let ly = 0
  if (d < frame.w) {
    lx = -half.w + d
    ly = -half.h
  } else if ((d -= frame.w) < frame.h) {
    lx = half.w
    ly = -half.h + d
  } else if ((d -= frame.h) < frame.w) {
    lx = half.w - d
    ly = half.h
  } else {
    d -= frame.w
    lx = -half.w
    ly = half.h - d
  }
  // une epaisseur de trait, pour que le cadre ne soit pas une ligne nue
  // une epaisseur de trait de quelques pixels, pas un remplissage
  lx += (Math.random() - 0.5) * 0.018
  ly += (Math.random() - 0.5) * 0.018
  const c = Math.cos(frame.tilt)
  const s = Math.sin(frame.tilt)
  return [frame.x + lx * c - ly * s, frame.y + lx * s + ly * c, (Math.random() - 0.5) * 0.012]
}

/** La texture du halo du soleil : un degrade radial, genere une fois. */
function glowTexture(): CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 107, 0, 0.42)')
  gradient.addColorStop(0.3, 'rgba(255, 107, 0, 0.14)')
  gradient.addColorStop(1, 'rgba(255, 107, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

export default function ParticleField({ label }: { label: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 720px)').matches
    const count = mobile ? MOBILE_COUNT : DESKTOP_COUNT

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })
    } catch {
      // pas de WebGL : la zone reste vide et le texte de l'en-tete, qui est
      // le contenu, ne bouge pas
      return
    }

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP))
    host.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('role', 'img')
    renderer.domElement.setAttribute('aria-label', label)

    const scene = new Scene()
    const camera = new PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, 3.2)

    // ── les attributs, calcules une fois ──────────────────────────────────
    const geometry = new BufferGeometry()
    const position = new Float32Array(count * 3)
    const ring = new Float32Array(count)
    const angle = new Float32Array(count)
    const spread = new Float32Array(count)
    const size = new Float32Array(count)
    const seed = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      ring[i] = i % 3
      angle[i] = Math.random() * Math.PI * 2
      spread[i] = 0.93 + Math.random() * 0.14
      size[i] = 1 + Math.random() * 2
      seed[i] = Math.random()

      const colour = pick(Math.random())
      colors[i * 3] = colour.r
      colors[i * 3 + 1] = colour.g
      colors[i * 3 + 2] = colour.b

      const [tx, ty, tz] = frameTarget(i, count)
      target[i * 3] = tx
      target[i * 3 + 1] = ty
      target[i * 3 + 2] = tz
    }

    geometry.setAttribute('position', new BufferAttribute(position, 3))
    geometry.setAttribute('aRing', new BufferAttribute(ring, 1))
    geometry.setAttribute('aAngle', new BufferAttribute(angle, 1))
    geometry.setAttribute('aSpread', new BufferAttribute(spread, 1))
    geometry.setAttribute('aSize', new BufferAttribute(size, 1))
    geometry.setAttribute('aSeed', new BufferAttribute(seed, 1))
    geometry.setAttribute('aColor', new BufferAttribute(colors, 3))
    geometry.setAttribute('aTarget', new BufferAttribute(target, 3))

    const uniforms = {
      uTime: { value: 0 },
      uTilt: { value: TILT },
      uPointer: { value: { x: 0, y: 0 } },
      uPointerActive: { value: 0 },
      uBurstOrigin: { value: { x: 0, y: 0 } },
      uBurst: { value: 0 },
      uMorph: { value: 0 },
      uIntro: { value: 1 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uScale: { value: 1 },
    }

    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
      // le fond du site est clair : un melange additif blanchirait les
      // particules au lieu de les poser sur le creme
      blending: NormalBlending,
    })

    const points = new Points(geometry, material)
    points.frustumCulled = false
    scene.add(points)

    // le soleil : un halo et un coeur de 12 px
    const texture = glowTexture()
    // melange normal, pas additif : sur un fond creme l'additif creuse un
    // trou blanc au centre de la ceinture
    const glow = new Sprite(new SpriteMaterial({ map: texture, transparent: true, blending: NormalBlending, depthWrite: false }))
    glow.scale.set(0.44, 0.44, 1)
    scene.add(glow)

    const coreGeometry = new BufferGeometry()
    coreGeometry.setAttribute('position', new BufferAttribute(new Float32Array([0, 0, 0]), 3))
    const coreMaterial = new ShaderMaterial({
        vertexShader: /* glsl */ `
          uniform float uPixelRatio;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = 12.0 * uPixelRatio;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float a = smoothstep(0.5, 0.2, d) * uOpacity;
            if (a < 0.01) discard;
            gl_FragColor = vec4(1.0, 0.42, 0.0, a);
          }
        `,
        uniforms: {
          uPixelRatio: { value: renderer.getPixelRatio() },
          uOpacity: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
    })

    const core = new Points(coreGeometry, coreMaterial)
    core.frustumCulled = false
    scene.add(core)

    // ── la taille, et l'echelle de la scene ───────────────────────────────
    const resize = () => {
      const rect = host.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return
      renderer.setSize(rect.width, rect.height, false)
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
      // la ceinture garde la meme taille apparente quelle que soit la boite
      uniforms.uScale.value = rect.width < 520 ? 0.78 : 1
      uniforms.uPixelRatio.value = renderer.getPixelRatio()
    }

    // ── le curseur, l'onde de choc et le defilement ───────────────────────
    const pointer = { x: 0, y: 0, active: 0 }
    const eased = { x: 0, y: 0, active: 0 }

    /** Du pixel ecran vers les unites de la scene, dans le plan z = 0. */
    const toScene = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect()
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1)
      const halfHeight = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
      return { x: nx * halfHeight * camera.aspect, y: ny * halfHeight }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left - 80 &&
        e.clientX <= rect.right + 80 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80
      pointer.active = inside ? 1 : 0
      if (!inside) return
      const p = toScene(e.clientX, e.clientY)
      pointer.x = p.x
      pointer.y = p.y
    }

    const onPointerDown = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return
      }
      const p = toScene(e.clientX, e.clientY)
      uniforms.uBurstOrigin.value = p
      uniforms.uBurst.value = 1
    }

    let morphTarget = 0
    const onScroll = () => {
      // la ceinture se reorganise sur la hauteur du premier ecran
      const t = window.scrollY / Math.max(1, window.innerHeight * 0.55)
      morphTarget = Math.max(0, Math.min(1, t))
      uniforms.uTilt.value = TILT + morphTarget * 0.08
    }

    // ── la boucle ─────────────────────────────────────────────────────────
    let frame = 0
    let last = 0
    let visible = true

    const render = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
      last = now

      uniforms.uTime.value += dt
      eased.x += (pointer.x - eased.x) * 0.08
      eased.y += (pointer.y - eased.y) * 0.08
      eased.active += (pointer.active - eased.active) * 0.08
      uniforms.uPointer.value = { x: eased.x, y: eased.y }
      uniforms.uPointerActive.value = eased.active

      // l'onde de choc retombe en une seconde, comme demande
      if (uniforms.uBurst.value > 0) {
        uniforms.uBurst.value = Math.max(0, uniforms.uBurst.value - dt)
      }

      // l'arrivee se pose en 1,4 s
      if (uniforms.uIntro.value > 0) {
        uniforms.uIntro.value = Math.max(0, uniforms.uIntro.value - dt / 1.4)
      }

      uniforms.uMorph.value += (morphTarget - uniforms.uMorph.value) * 0.07

      // le soleil n'a plus de raison d'etre quand la ceinture s'est changee
      // en cadres d'ecrans
      const sun = 1 - uniforms.uMorph.value
      glow.material.opacity = Math.max(0, sun)
      coreMaterial.uniforms.uOpacity.value = Math.max(0, sun)

      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    resize()

    if (reduced) {
      // une image fixe de la ceinture, et rien d'autre
      uniforms.uIntro.value = 0
      renderer.render(scene, camera)
      const onResizeOnly = () => {
        resize()
        renderer.render(scene, camera)
      }
      window.addEventListener('resize', onResizeOnly)
      return () => {
        window.removeEventListener('resize', onResizeOnly)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        host.replaceChildren()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting
        if (next === visible) return
        visible = next
        if (visible) {
          last = 0
          frame = requestAnimationFrame(render)
        } else {
          cancelAnimationFrame(frame)
        }
      },
      { threshold: 0 },
    )
    observer.observe(host)

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    onScroll()
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      texture.dispose()
      geometry.dispose()
      coreGeometry.dispose()
      material.dispose()
      coreMaterial.dispose()
      renderer.dispose()
      host.replaceChildren()
    }
  }, [label])

  return <div className="field" ref={hostRef} />
}
