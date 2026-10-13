'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Le manifeste : un grand texte qui se colore au defilement.
 *
 * Les mots passent du bleu-gris a l'encre, un par un, au fur et a mesure que
 * le bloc traverse l'ecran. La progression est lue au defilement et n'anime
 * rien d'autre que la couleur, donc elle ne provoque ni calcul de mise en
 * page ni saut. Si le visiteur reduit les animations, tout le texte est
 * encre des le depart.
 */
export default function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(1)
  const words = text.split(/(\s+)/)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setProgress(0)
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      // 0 quand le bloc entre par le bas, 1 quand il a atteint le tiers haut
      const start = window.innerHeight * 0.85
      const end = window.innerHeight * 0.35
      const t = (start - rect.top) / Math.max(1, start - end)
      setProgress(Math.max(0, Math.min(1, t)))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const total = words.filter((w) => !/^\s+$/.test(w)).length
  let index = 0

  return (
    <p className="manifesto" ref={ref}>
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return word
        const lit = index++ / Math.max(1, total - 1) <= progress
        return (
          <span className="manifesto__word" key={i} data-lit={lit}>
            {word}
          </span>
        )
      })}
    </p>
  )
}
