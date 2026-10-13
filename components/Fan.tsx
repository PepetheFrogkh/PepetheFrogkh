'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n'
import { TRIGGER, reduced, small, useGsap } from '@/lib/motion'
import { Tbd } from './Tbd'

/**
 * L'eventail de realisations.
 *
 * Le cahier : les ecrans montent d'une courbe d'horizon creme et lumineuse,
 * et se deploient en eventail pendant le defilement. La courbe est un calque
 * en degrade derriere les cartes ; le deploiement est pilote au defilement,
 * donc il avance et recule avec le geste du visiteur au lieu de jouer une
 * fois.
 *
 * Au repos les cartes sont empilees au centre et sous l'horizon. A la fin du
 * deploiement elles sont en eventail, inclinees, comme chez TechFlow.
 */
export default function Fan({
  locale,
  shots,
}: {
  locale: Locale
  shots: { name: string; shot: string | null; site?: string | null }[]
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return

    const gsap = useGsap()
    const cards = [...node.querySelectorAll<HTMLElement>('.fan__card')]
    const middle = (cards.length - 1) / 2
    const narrow = small()

    const ctx = gsap.context(() => {
      // l'etat ferme : empilees au centre, sous la ligne d'horizon
      gsap.set(cards, { yPercent: 38, rotate: 0, x: 0, scale: 0.88, opacity: 0.35 })

      gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: TRIGGER,
          end: 'bottom 55%',
          scrub: 0.6,
        },
      }).to(cards, {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        // chaque carte s'ecarte du centre et s'incline : l'eventail
        x: (i: number) => (i - middle) * (narrow ? 0 : 18),
        rotate: (i: number) => (i - middle) * (narrow ? 0 : 6),
        ease: 'power2.out',
        stagger: 0.08,
      })
    }, node)

    return () => ctx.revert()
  }, [])

  return (
    <div className="fan" ref={ref}>
      <div className="fan__horizon" aria-hidden="true" />
      <div className="fan__cards">
        {shots.map((item) => (
          <figure className="fan__card" key={item.name}>
            {item.shot ? (
              <img src={item.shot} alt={item.name} loading="lazy" />
            ) : (
              <span className="fan__empty">
                <Tbd locale={locale} what={item.name} />
              </span>
            )}
            <figcaption className="fan__name">{item.site ?? item.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
