'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { TRIGGER, reduced, useGsap } from '@/lib/motion'

/**
 * Une image revelee par un masque.
 *
 * Le cahier le demande pour les realisations. Le masque est un `clip-path`
 * qui s'ouvre du bas vers le haut : l'image n'est jamais remplacee par un
 * vide, elle se devoile, et le texte autour reste lisible pendant tout
 * l'effet.
 */
export default function MaskReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return

    const gsap = useGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 0.9,
          delay: delay / 1000,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: TRIGGER, once: true },
        },
      )
    }, node)

    return () => ctx.revert()
  }, [delay])

  return (
    <div className={['mask-reveal', className].filter(Boolean).join(' ')} ref={ref}>
      {children}
    </div>
  )
}
