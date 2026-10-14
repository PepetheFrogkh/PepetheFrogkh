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
 *
 * L'ouverture et son decalage tiennent ensemble dans les 300 ms du cahier, et
 * elle part des que 15 % du bloc est a l'ecran. Une carte deja visible au
 * chargement n'est pas masquee pour etre revelee ensuite.
 *
 * Au survol, une onde part du point touche par le curseur et se dissipe. Elle
 * ne cache rien : c'est un halo orange tres clair, par-dessus l'image, qui
 * dure 600 ms et ne se declenche que sur un appareil a souris.
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

    // deja a l'ecran au chargement : rien a reveler, le contenu reste lisible
    const box = node.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) return

    const wait = Math.max(0, Math.min(delay, 90))
    const gsap = useGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.04 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: (300 - wait) / 1000,
          delay: wait / 1000,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: TRIGGER, once: true },
        },
      )
    }, node)

    return () => ctx.revert()
  }, [delay])

  // ── l'onde au survol ──────────────────────────────────────────────────
  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onEnter = (event: PointerEvent) => {
      const box = node.getBoundingClientRect()
      node.style.setProperty('--rx', `${event.clientX - box.left}px`)
      node.style.setProperty('--ry', `${event.clientY - box.top}px`)
      // relancer l'animation : on la coupe, on force un calcul, on la remet
      node.removeAttribute('data-ripple')
      void node.offsetWidth
      node.setAttribute('data-ripple', 'on')
    }
    const onEnd = () => node.removeAttribute('data-ripple')

    node.addEventListener('pointerenter', onEnter)
    node.addEventListener('animationend', onEnd)
    return () => {
      node.removeEventListener('pointerenter', onEnter)
      node.removeEventListener('animationend', onEnd)
    }
  }, [])

  return (
    <div className={['mask-reveal', className].filter(Boolean).join(' ')} ref={ref}>
      {children}
    </div>
  )
}
