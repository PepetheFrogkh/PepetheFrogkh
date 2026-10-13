'use client'

import { useEffect, useRef } from 'react'
import type { MethodStep } from '@/content'
import { reduced, useGsap } from '@/lib/motion'

/**
 * La methode : une section epinglee, une etape par cran de defilement, la
 * frise qui avance.
 *
 * Chaque cran allume l'etape suivante et fait avancer le trait de la frise.
 * Les six intitules sont dans le HTML des le depart et restent lisibles :
 * l'etape courante est mise en avant, les autres sont en retrait, aucune
 * n'est cachee.
 */
export default function PinnedMethod({
  title,
  intro,
  steps,
}: {
  title: string
  intro: string
  steps: MethodStep[]
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return

    const gsap = useGsap()
    const items = [...node.querySelectorAll<HTMLElement>('.frieze__step')]
    const line = node.querySelector<HTMLElement>('.frieze__progress')
    if (items.length === 0) return

    const ctx = gsap.context(() => {
      // L'etape courante est deduite de la progression, pas d'une suite de
      // callbacks : avec un scrub, un onComplete par etape se declenche en
      // rafale et les six s'allument d'un coup.
      const last = items.length - 1
      // Sans JavaScript et avec les animations reduites, les six etapes sont
      // actives : le script ne fait que resserrer sur l'etape courante.
      const apply = (progress: number) => {
        const current = Math.round(progress * last)
        items.forEach((item, i) => item.setAttribute('data-active', String(i <= current)))
        if (line) line.style.transform = `scaleX(${progress.toFixed(4)})`
      }

      apply(0)

      gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          // un cran par etape
          end: () => `+=${items.length * 55}%`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / last,
            duration: 0.25,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => apply(self.progress),
        },
      })
    }, node)

    return () => ctx.revert()
  }, [steps])

  return (
    <section className="section section--cream method-pin" ref={ref}>
      <div className="container">
        <div className="section__head">
          <h2>{title}</h2>
          <p className="lead">{intro}</p>
        </div>
        <ol className="frieze">
          <div className="frieze__rail" aria-hidden="true">
            <span className="frieze__progress" />
          </div>
          {steps.map((step, i) => (
            <li className="frieze__step" key={step.title} data-active={true}>
              <span className="frieze__dot" aria-hidden="true" />
              <span className="frieze__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="frieze__title">{step.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
