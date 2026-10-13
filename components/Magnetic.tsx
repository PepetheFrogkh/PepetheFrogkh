'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Les boutons aimantes : ils suivent legerement la souris.
 *
 * Le deplacement est plafonne a 8 px, et la cible de clic ne bouge pas plus
 * que ca : un bouton qui fuit le curseur est un bouton qu'on rate. L'effet
 * n'existe que sur un appareil a souris, et pas du tout si le visiteur reduit
 * les animations.
 */
const MAX = 8

export default function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    let frame = 0
    let running = false

    const loop = () => {
      eased.x += (target.x - eased.x) * 0.16
      eased.y += (target.y - eased.y) * 0.16
      node.style.transform = `translate3d(${eased.x.toFixed(2)}px, ${eased.y.toFixed(2)}px, 0)`
      if (Math.abs(target.x - eased.x) < 0.05 && Math.abs(target.y - eased.y) < 0.05 && target.x === 0 && target.y === 0) {
        running = false
        node.style.transform = ''
        return
      }
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const reach = Math.max(rect.width, rect.height) * 1.1
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > reach) {
        target.x = 0
        target.y = 0
      } else {
        const strength = 1 - dist / reach
        target.x = Math.max(-MAX, Math.min(MAX, dx * 0.35 * strength))
        target.y = Math.max(-MAX, Math.min(MAX, dy * 0.35 * strength))
      }
      start()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      node.style.transform = ''
    }
  }, [])

  return (
    <span className="magnetic" ref={ref}>
      {children}
    </span>
  )
}
