'use client'

import { useEffect, useRef } from 'react'
import { track, type TrackedEvent } from '@/lib/analytics'

/**
 * Declenche un evenement une seule fois, quand le bloc entre a l'ecran.
 *
 * Sert au « prix affiche » de la liste d'evenements du cahier. Comme tout
 * passe par `lib/analytics`, rien n'est envoye sans consentement.
 */
export default function TrackVisible({ event }: { event: TrackedEvent }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        track(event)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [event])

  return <span ref={ref} aria-hidden="true" />
}
