'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Le curseur personnalise « Voir », au survol des realisations.
 *
 * Il ne remplace pas le curseur du systeme partout : il n'apparait qu'au
 * dessus d'un element marque `data-cursor="voir"`, et seulement sur un
 * appareil a souris. Sur un ecran tactile et quand le visiteur reduit les
 * animations, il n'existe pas : un curseur qui suit le doigt n'a pas de sens,
 * et le lien reste un lien.
 */
export default function ViewCursor({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const node = ref.current
    if (!node) return

    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    let frame = 0
    let visible = false

    const loop = () => {
      eased.x += (target.x - eased.x) * 0.18
      eased.y += (target.y - eased.y) * 0.18
      node.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`
      frame = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      const over = (e.target as Element | null)?.closest('[data-cursor="voir"]') != null
      if (over !== visible) {
        visible = over
        setShown(over)
        document.body.classList.toggle('has-view-cursor', over)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.body.classList.remove('has-view-cursor')
    }
  }, [])

  return (
    <div className="view-cursor" ref={ref} data-shown={shown} aria-hidden="true">
      {label}
    </div>
  )
}
