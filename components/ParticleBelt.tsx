'use client'

import { useEffect, useRef } from 'react'

/**
 * La ceinture de particules de l'en-tete.
 *
 * C'est la seule animation forte du site, et elle est dessinee en canvas 2D,
 * pas en 3D : le cahier l'ecrit noir sur blanc, et une ceinture de 900 points
 * en 2D coute une fraction d'un contexte WebGL, sans le cas « ce navigateur
 * ne peut pas ».
 *
 * Le cahier fixe : un soleil orange vif de 12 px, trois orbites elliptiques
 * inclinees d'environ -18 degres, 600 a 900 particules (250 sur mobile)
 * reparties 60 % orange vif, 25 % orange terre, 15 % bleu-gris clair, de 1 a
 * 3 px, d'opacite 0,4 a 1, les plus grosses devant ; un tour complet en 60 a
 * 90 secondes ; un suivi de souris de 12 px au plus ; une inclinaison legere
 * au defilement ; une densite d'affichage limitee a 2 ; une pause hors de
 * l'ecran. Si le visiteur reduit les animations, une seule image fixe est
 * dessinee et la boucle ne demarre pas.
 */

const TILT = (-18 * Math.PI) / 180
const PERIOD_MS = 75_000 // un tour complet, dans la fourchette 60 a 90 s
const MAX_PARALLAX = 12 // px, le maximum impose par le cahier
const SUN_SIZE = 12 // px
const DPR_CAP = 2

const COLOURS = [
  { hex: '255, 107, 0', share: 0.6 }, // orange vif
  { hex: '194, 65, 12', share: 0.25 }, // orange terre
  { hex: '138, 151, 171', share: 0.15 }, // bleu-gris clair, decor seulement
]

interface Particle {
  /** L'orbite : 0, 1 ou 2. */
  ring: number
  /** L'angle de depart sur l'orbite. */
  phase: number
  /** Le rayon, avec sa dispersion autour de l'orbite. */
  spread: number
  size: number
  alpha: number
  colour: string
}

function pickColour(r: number): string {
  let acc = 0
  for (const c of COLOURS) {
    acc += c.share
    if (r < acc) return c.hex
  }
  return COLOURS[0].hex
}

function build(count: number): Particle[] {
  const out: Particle[] = new Array(count)
  for (let i = 0; i < count; i++) {
    out[i] = {
      ring: i % 3,
      phase: Math.random() * Math.PI * 2,
      spread: 0.94 + Math.random() * 0.12,
      size: 1 + Math.random() * 2,
      alpha: 0.4 + Math.random() * 0.6,
      colour: pickColour(Math.random()),
    }
  }
  return out
}

export default function ParticleBelt({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 720px)').matches
    const particles = build(mobile ? 250 : 900)

    let width = 0
    let height = 0
    let frame = 0
    let visible = true
    let started = 0

    // le suivi de souris et l'inclinaison au defilement, lisses
    const pointer = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    let scrollTilt = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2 + eased.x
      const cy = height / 2 + eased.y
      const unit = Math.min(width, height) / 2
      const tilt = TILT + scrollTilt
      const cos = Math.cos(tilt)
      const sin = Math.sin(tilt)
      const turn = (elapsed / PERIOD_MS) * Math.PI * 2

      // les trois orbites : demi-grand axe, demi-petit axe
      const rings = [
        { a: unit * 0.58, b: unit * 0.17 },
        { a: unit * 0.76, b: unit * 0.23 },
        { a: unit * 0.94, b: unit * 0.29 },
      ]

      // les plus grosses devant : on dessine du fond vers l'avant
      const sorted = particles
        .map((p) => {
          const angle = p.phase + turn * (1 - p.ring * 0.08)
          return { p, angle, depth: Math.sin(angle) }
        })
        .sort((l, r) => l.depth - r.depth)

      // le soleil est derriere les particules de devant
      let sunDrawn = false
      const drawSun = () => {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, SUN_SIZE * 2.6)
        glow.addColorStop(0, 'rgba(255, 107, 0, 0.55)')
        glow.addColorStop(1, 'rgba(255, 107, 0, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, SUN_SIZE * 2.6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'rgb(255, 107, 0)'
        ctx.beginPath()
        ctx.arc(cx, cy, SUN_SIZE / 2, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const { p, angle, depth } of sorted) {
        if (!sunDrawn && depth >= 0) {
          drawSun()
          sunDrawn = true
        }

        const ring = rings[p.ring]
        const ox = Math.cos(angle) * ring.a * p.spread
        const oy = Math.sin(angle) * ring.b * p.spread
        const x = cx + ox * cos - oy * sin
        const y = cy + ox * sin + oy * cos

        // la profondeur porte la taille et l'opacite
        const front = (depth + 1) / 2
        const size = p.size * (0.6 + front * 0.7)
        const alpha = p.alpha * (0.45 + front * 0.55)

        ctx.fillStyle = `rgba(${p.colour}, ${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!sunDrawn) drawSun()
    }

    const loop = (now: number) => {
      if (!started) started = now
      eased.x += (pointer.x - eased.x) * 0.06
      eased.y += (pointer.y - eased.y) * 0.06
      draw(now - started)
      frame = requestAnimationFrame(loop)
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      pointer.x = Math.max(-1, Math.min(1, nx)) * MAX_PARALLAX
      pointer.y = Math.max(-1, Math.min(1, ny)) * MAX_PARALLAX
    }

    const onScroll = () => {
      // une inclinaison legere, 4 degres au plus sur le premier ecran
      const t = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
      scrollTilt = (t * 4 * Math.PI) / 180
    }

    resize()

    if (reduced) {
      // une image fixe de la ceinture, et rien d'autre
      draw(0)
      const onResize = () => {
        resize()
        draw(0)
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting
        if (next === visible) return
        visible = next
        if (visible) {
          started = 0
          frame = requestAnimationFrame(loop)
        } else {
          cancelAnimationFrame(frame)
        }
      },
      { threshold: 0 },
    )
    observer.observe(canvas)

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return <canvas ref={canvasRef} role="img" aria-label={label} />
}
