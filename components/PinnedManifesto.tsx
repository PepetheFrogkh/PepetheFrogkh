'use client'

import { useEffect, useRef } from 'react'
import { reduced, useGsap } from '@/lib/motion'

/**
 * Le manifeste : une section epinglee, dont le tres grand texte se colore mot
 * apres mot en orange terre pendant le defilement.
 *
 * L'epinglage tient la section a l'ecran le temps que la phrase se colore,
 * puis la relache. Le texte est encre au depart et ne devient jamais
 * invisible : il change de couleur, il n'apparait pas, donc la regle du
 * cahier sur le contenu visible par defaut est tenue meme a mi-parcours.
 */
export default function PinnedManifesto({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return

    const gsap = useGsap()
    const words = [...node.querySelectorAll<HTMLElement>('.manifesto__word')]

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top top',
            // la duree de l'epinglage : un ecran et demi de defilement
            end: '+=140%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        })
        .to(words, { color: 'var(--terra)', stagger: 0.5, ease: 'none' }, 0)
    }, node)

    return () => ctx.revert()
  }, [text])

  return (
    <section className="section manifesto-pin" ref={ref}>
      <div className="container">
        <p className="manifesto">
          {text.split(/(\s+)/).map((word, i) =>
            /^\s+$/.test(word) ? (
              word
            ) : (
              <span className="manifesto__word" key={i}>
                {word}
              </span>
            ),
          )}
        </p>
      </div>
    </section>
  )
}
