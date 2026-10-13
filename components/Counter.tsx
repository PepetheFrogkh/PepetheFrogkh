'use client'

import { useEffect, useRef, useState } from 'react'
import type { Figure } from '@/content'

/**
 * Un chiffre qui defile jusqu'a sa valeur quand il devient visible.
 *
 * La valeur de depart est la valeur finale : sans JavaScript, ou avec les
 * animations reduites, le chiffre est simplement juste.
 */
export default function Counter({ figure }: { figure: Figure }) {
  const target = Number(figure.value.replace(/\s/g, ''))
  const numeric = Number.isFinite(target)
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(target)

  useEffect(() => {
    const node = ref.current
    if (!node || !numeric) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const duration = 900
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          // une sortie douce, pour que le dernier chiffre se pose
          const eased = 1 - Math.pow(1 - t, 3)
          setShown(Math.round(target * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        setShown(0)
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [numeric, target])

  return (
    <div ref={ref}>
      <div className="figure__value">
        {figure.prefix}
        {numeric ? shown.toLocaleString('fr-FR') : figure.value}
        {figure.unit}
      </div>
      <div className="figure__caption">{figure.caption}</div>
    </div>
  )
}
