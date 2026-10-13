'use client'

import { useEffect, useRef } from 'react'
import type { MethodStep } from '@/content'
import { reduced, small, useGsap } from '@/lib/motion'
import StepDiagram from './StepDiagram'

/**
 * La methode : six etapes qui defilent horizontalement, menees par le
 * defilement vertical.
 *
 * Une frise de six mots ne montre rien. Ici chaque etape est une carte plein
 * format, avec son schema, et le defilement fait avancer la piste : le geste
 * du visiteur est le geste de la methode. La barre de progression et le
 * compteur disent ou on en est.
 *
 * Sans JavaScript et quand le visiteur reduit les animations, la piste est une
 * grille qui se lit de haut en bas : les six etapes et leurs schemas sont
 * tous presents, rien n'est cache derriere une animation.
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
    const track = node.querySelector<HTMLElement>('.track')
    const cards = [...node.querySelectorAll<HTMLElement>('.track__card')]
    const bar = node.querySelector<HTMLElement>('.track__bar')
    const counter = node.querySelector<HTMLElement>('.track__counter b')
    if (!track || cards.length === 0) return

    node.dataset.enhanced = 'true'

    const ctx = gsap.context(() => {
      const last = cards.length - 1

      const distance = () => Math.max(0, track.scrollWidth - node.clientWidth + 48)

      gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          // la course verticale correspond a la course horizontale
          end: () => `+=${distance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const x = -distance() * self.progress
            gsap.set(track, { x })
            if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`

            // la carte au centre est mise en avant, les autres restent
            // lisibles mais en retrait
            const current = Math.round(self.progress * last)
            cards.forEach((card, i) => card.setAttribute('data-active', String(i === current)))
            if (counter) counter.textContent = String(current + 1).padStart(2, '0')
          },
        },
      })
    }, node)

    return () => {
      ctx.revert()
      delete node.dataset.enhanced
    }
  }, [steps.length])

  return (
    <section className="section section--cream method" ref={ref}>
      <div className="container">
        <div className="section__head">
          <h2>{title}</h2>
          <p className="lead">{intro}</p>
        </div>
      </div>

      <div className="method__viewport">
        <ol className="track">
          {steps.map((step, i) => (
            <li className="track__card" key={step.title} data-active={i === 0}>
              <div className="track__index">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="track__title">{step.title}</h3>
              {step.demo ? (
                <img className="track__demo" src={step.demo} alt={step.title} loading="lazy" />
              ) : (
                <StepDiagram index={i} />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="container">
        <div className="track__progress" aria-hidden="true">
          <span className="track__bar" />
        </div>
        <p className="track__counter small muted">
          <b>01</b> / {String(steps.length).padStart(2, '0')}
        </p>
      </div>
    </section>
  )
}
