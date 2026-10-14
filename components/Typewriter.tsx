'use client'

import { useEffect, useRef, useState } from 'react'
import { reduced, useGsap } from '@/lib/motion'

/**
 * La transition tapee a la machine.
 *
 * Une section epinglee ou une phrase s'ecrit lettre a lettre pendant que le
 * visiteur descend, s'efface, et laisse la place a la suivante. Le curseur,
 * lui, clignote de son cote : c'est la seule chose qui ne depend pas du
 * defilement, parce qu'un curseur qui ne clignote qu'en descendant ne
 * ressemble a rien.
 *
 * Les trois mots restent affiches sous la ligne, celui en cours marque : la
 * section n'est donc jamais un ecran vide pendant qu'un mot s'ecrit, et c'est
 * aussi ce que lit un lecteur d'ecran, pour qui la ligne tapee est
 * decorative. Sans JavaScript, et en mouvement reduit, la liste s'affiche en
 * entier et rien n'est epingle : le cahier interdit qu'une animation cache un
 * texte.
 */
export default function Typewriter({ before, items }: { before: string; items: string[] }) {
  const section = useRef<HTMLElement>(null)
  const [typed, setTyped] = useState('')
  const [at, setAt] = useState(0)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const node = section.current
    if (!node || reduced() || items.length === 0) return
    setLive(true)

    const gsap = useGsap()
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          // une transition, pas un chapitre : 45 % d'ecran par mot
          end: () => `+=${items.length * 45}%`,
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // chaque mot occupe sa tranche : il s'ecrit, il reste, il s'efface
            const span = 1 / items.length
            const index = Math.min(items.length - 1, Math.floor(self.progress / span))
            const local = (self.progress - index * span) / span
            const word = items[index]
            const shown =
              local < 0.45
                ? Math.round((local / 0.45) * word.length)
                : local < 0.75
                  ? word.length
                  : Math.round((1 - (local - 0.75) / 0.25) * word.length)
            setAt(index)
            setTyped(word.slice(0, Math.max(0, shown)))
          },
        },
      })
    }, node)

    return () => ctx.revert()
  }, [items])

  return (
    <section className="type" ref={section}>
      <div className="container type__inner">
        <p className="type__line" aria-hidden={live ? true : undefined}>
          <span className="type__before">{before}</span>{' '}
          {live ? (
            <>
              <span className="type__word">{typed}</span>
              <span className="type__caret" />
            </>
          ) : (
            // sans JavaScript, ou en mouvement reduit : la liste en entier
            <span className="type__word">{items.join(', ')}.</span>
          )}
        </p>

        {/* Les trois mots restent lisibles tout du long, celui en cours
            marque : la section dit ou elle en est, et elle n'est jamais un
            ecran vide pendant que le mot s'ecrit. C'est aussi ce que lit un
            lecteur d'ecran. */}
        <ol className="type__all">
          {items.map((item, i) => (
            <li key={item} data-active={live ? i === at : undefined}>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
