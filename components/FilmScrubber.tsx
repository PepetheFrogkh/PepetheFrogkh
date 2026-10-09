'use client'

import { useEffect, useRef, useState } from 'react'
import { scroll } from '@/lib/scrollState'
import { useApp } from '@/lib/useAppStore'

/**
 * The hero is a raytraced film, scrubbed by the scroll.
 *
 * The realtime WebGL version of this page could not produce refraction
 * through curved glass, caustics or volumetric absorption, which is most of
 * what makes a bottle look like a bottle. These frames come out of Cycles
 * (see `scripts/render/`), so the page ships photographs of a scene that does
 * not exist rather than a live approximation of one.
 *
 * Loading is progressive and deliberately out of order: every eighth frame
 * first, so the whole film is coarsely scrubbable within a second or so, then
 * the gaps fill in. Until a frame has decoded, the nearest one that has is
 * drawn instead, so scrolling is never blocked on a download.
 */

export interface FilmManifest {
  frames: number
  width: number
  height: number
  /** e.g. "/film/%04d.jpg" */
  pattern: string
}

function framePath(m: FilmManifest, i: number) {
  return m.pattern.replace(/%0(\d)d/, (_, w: string) => String(i).padStart(+w, '0'))
}

export default function FilmScrubber({ manifest }: { manifest: FilmManifest }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const setLoaded = useApp((s) => s.setLoaded)
  const reduced = useApp((s) => s.reducedMotion)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const total = manifest.frames
    const bitmaps: (ImageBitmap | null)[] = new Array(total).fill(null)
    let alive = true
    let firstDrawn = false

    // ── decode one frame ────────────────────────────────────────────────
    const fetchFrame = async (i: number) => {
      if (!alive || bitmaps[i]) return
      try {
        const res = await fetch(framePath(manifest, i), { cache: 'force-cache' })
        if (!res.ok) return
        const blob = await res.blob()
        const bmp = await createImageBitmap(blob)
        if (!alive) {
          bmp.close()
          return
        }
        bitmaps[i] = bmp
        if (!firstDrawn) {
          firstDrawn = true
          setReady(true)
          setLoaded(true)
        }
      } catch {
        // a dropped frame is survivable: the nearest one is drawn instead
      }
    }

    // ── progressive waves, coarse to fine ───────────────────────────────
    const load = async () => {
      for (const stride of [8, 4, 2, 1]) {
        const order: number[] = []
        for (let i = 0; i < total; i += stride) if (!bitmaps[i]) order.push(i)
        // a few at a time: enough to saturate the connection, not enough to
        // starve the frame the viewer is actually looking at
        const CONCURRENCY = 6
        for (let k = 0; k < order.length; k += CONCURRENCY) {
          if (!alive) return
          await Promise.all(order.slice(k, k + CONCURRENCY).map(fetchFrame))
        }
      }
    }
    void load()

    // ── draw ────────────────────────────────────────────────────────────
    const nearest = (i: number) => {
      if (bitmaps[i]) return bitmaps[i]
      for (let r = 1; r < total; r++) {
        if (bitmaps[i - r]) return bitmaps[i - r]
        if (bitmaps[i + r]) return bitmaps[i + r]
      }
      return null
    }

    let raf = 0
    let lastIndex = -1
    let lastW = 0
    let lastH = 0

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      const index = Math.min(total - 1, Math.max(0, Math.round(scroll.progress * (total - 1))))
      if (index === lastIndex && w === lastW && h === lastH) return

      const bmp = nearest(index)
      if (!bmp) return
      if (w !== lastW || h !== lastH) {
        canvas.width = w
        canvas.height = h
        lastW = w
        lastH = h
      }
      lastIndex = index

      // cover, anchored slightly above centre so the subject stays framed
      // when a tall phone crops a 16:10 frame
      const sa = bmp.width / bmp.height
      const da = w / h
      let dw = w
      let dh = h
      if (da > sa) dh = w / sa
      else dw = h * sa
      ctx.drawImage(bmp, (w - dw) / 2, (h - dh) * 0.42, dw, dh)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      for (const b of bitmaps) b?.close()
    }
  }, [manifest, setLoaded])

  if (reduced) return null

  return (
    <div className="film-layer" aria-hidden="true" data-ready={ready}>
      <canvas ref={canvasRef} />
    </div>
  )
}
