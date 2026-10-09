'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scroll, SCENES, sceneAt } from '@/lib/scrollState'
import { useApp } from '@/lib/useAppStore'

/**
 * One Lenis instance, one ScrollTrigger spanning the whole page, one number.
 * Everything in the scene reads `scroll.progress`; nothing else drives time.
 */
export default function ScrollDriver() {
  const setScene = useApp((s) => s.setScene)
  const reduced = useApp((s) => s.reducedMotion)
  const jumpTo = useApp((s) => s.jumpTo)
  const requestJump = useApp((s) => s.requestJump)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = reduced
      ? null
      : new Lenis({
          duration: 1.1,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          wheelMultiplier: 0.9,
          touchMultiplier: 1.4,
        })

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      // store the ticker callback so cleanup can remove the right one
      ;(lenis as unknown as { _raf?: (t: number) => void })._raf = raf
    }

    let last = -1
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scroll.progress = self.progress
        scroll.velocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 3000)
        const i = sceneAt(self.progress)
        if (i !== last) {
          last = i
          setScene(i)
        }
      },
    })

    const onPointer = (e: PointerEvent) => {
      scroll.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      scroll.pointerY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointer)
      trigger.kill()
      if (lenis) {
        const raf = (lenis as unknown as { _raf?: (t: number) => void })._raf
        if (raf) gsap.ticker.remove(raf)
        lenis.destroy()
      }
    }
  }, [reduced, setScene])

  // Beer selector / deep links: scroll to the middle of a plan.
  useEffect(() => {
    if (!jumpTo) return
    const target = jumpTo === 'black' ? 'black' : 'condensation'
    const s = SCENES.find((x) => x.id === target)
    if (s) {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: (s.start + 0.25 * (s.end - s.start)) * max, behavior: 'smooth' })
    }
    requestJump(null)
  }, [jumpTo, requestJump])

  return null
}
