'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { reduced, useGsap } from '@/lib/motion'

/**
 * Une section qui arrive comme un grand bloc aux coins tres arrondis, et qui
 * glisse par-dessus la precedente.
 *
 * Le bloc monte de quelques dizaines de pixels pendant qu'il entre, et ses
 * coins se referment : au repos il est carre et colle a la section suivante,
 * en arrivee il est arrondi et detache. L'effet est pilote au defilement.
 *
 * La section est opaque et son contenu n'est jamais masque : seul le cadre
 * bouge, donc rien ne disparait pendant le geste.
 */
export default function SectionBlock({
  children,
  tone = 'white',
  className,
  id,
}: {
  children: ReactNode
  tone?: 'white' | 'cream' | 'peach'
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return

    const gsap = useGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { y: 56, borderRadius: 56 },
        {
          y: 0,
          borderRadius: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top bottom',
            end: 'top 55%',
            scrub: 0.5,
          },
        },
      )
    }, node)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className={['block', `block--${tone}`, className].filter(Boolean).join(' ')}
      ref={ref}
      id={id}
    >
      <div className="container">{children}</div>
    </section>
  )
}
