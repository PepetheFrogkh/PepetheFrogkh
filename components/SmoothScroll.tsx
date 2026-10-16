'use client'

import { useEffect } from 'react'

/**
 * Le defilement amorti, avec Lenis, branche sur ScrollTrigger.
 *
 * Lenis prend la main sur le defilement et ScrollTrigger lit sa position :
 * sans ce branchement, les deux calculent chacun leur avancement et les
 * sections epinglees sautent.
 *
 * Rien n'est charge quand le visiteur reduit les animations : le defilement
 * reste celui du navigateur, qui est le bon dans ce cas.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let destroy = () => {}
    let cancelled = false

    void (async () => {
      const [{ default: Lenis }, { useGsap, ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('@/lib/motion'),
      ])
      if (cancelled) return
      const gsap = useGsap()

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        // le defilement tactile reste natif : l'amortir donne une sensation
        // de flottement sur telephone
        smoothWheel: true,
        touchMultiplier: 1.6,
      })

      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      document.documentElement.classList.add('lenis')

      destroy = () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        document.documentElement.classList.remove('lenis')
      }
    })()

    return () => {
      cancelled = true
      destroy()
    }
  }, [])

  return null
}
