'use client'

import { useEffect } from 'react'
import { AGE_KEY, useApp } from '@/lib/useAppStore'

/** One-off environment checks, run before anything else mounts. */
export default function Boot() {
  const setReducedMotion = useApp((s) => s.setReducedMotion)
  const setAgeOk = useApp((s) => s.setAgeOk)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)

    try {
      if (localStorage.getItem(AGE_KEY) === 'yes') setAgeOk(true)
    } catch {
      // private mode: the gate just shows again
    }

    return () => mq.removeEventListener('change', sync)
  }, [setReducedMotion, setAgeOk])

  return null
}
