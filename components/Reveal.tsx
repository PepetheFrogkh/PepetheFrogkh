'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Apparition en fondu avec une montee de 16 px, au moment ou le bloc entre a
 * l'ecran. La duree et la courbe sont dans la feuille de style, qui coupe
 * aussi l'effet quand le visiteur reduit les animations.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  id,
}: {
  children: ReactNode
  delay?: number
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
