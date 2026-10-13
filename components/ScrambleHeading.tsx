'use client'

import { useEffect, useRef, type ElementType } from 'react'

/**
 * Le titre principal : les mots passent du flou au net, et quelques lettres
 * se brouillent avant de se fixer.
 *
 * Le texte final est dans le HTML des le rendu serveur, donc il est lisible
 * sans JavaScript et pour un moteur de recherche. Le brouillage ne remplace
 * que quelques lettres, et jamais plus de 300 ms chacune, comme l'impose la
 * regle du cahier : l'animation ne cache pas le texte, elle le revele.
 */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*%&'
/** Au plus une lettre sur cinq se brouille. */
const SCRAMBLE_RATIO = 0.2
/**
 * Le brouillage entier tient dans cette duree, et il commence tout de suite
 * pour toutes les lettres choisies : la regle du cahier veut qu'aucune
 * animation ne cache un texte plus de 300 ms, et un brouillage decale mot par
 * mot laisserait les derniers mots faux bien au-dela.
 */
const SCRAMBLE_MS = 260

export default function ScrambleHeading({
  text,
  as: Tag = 'h1',
  className,
}: {
  text: string
  as?: ElementType
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  // « Ameliorez l'experience. *Mesurez-la.* » : le mot entre asterisques
  // passe en italique orange terre
  const segments = text.split(/(\*[^*]+\*)/).filter(Boolean)
  let wordIndex = 0
  const rendered = segments.map((segment, s) => {
    const accent = segment.startsWith('*') && segment.endsWith('*')
    const body = accent ? segment.slice(1, -1) : segment
    return (
      <span key={s} className={accent ? 'accent' : undefined}>
        {body.split(/(\s+)/).map((piece, i) => {
          if (/^\s+$/.test(piece)) return piece
          const delay = wordIndex++ * 60
          return (
            <span className="word" key={i} style={{ animationDelay: `${delay}ms` }}>
              {[...piece].map((letter, l) => (
                <span className="letter" data-letter={letter} key={l}>
                  {letter}
                </span>
              ))}
            </span>
          )
        })}
      </span>
    )
  })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = [...node.querySelectorAll<HTMLElement>('.letter')]
    const chosen = letters.filter(() => Math.random() < SCRAMBLE_RATIO)
    const timers: number[] = []

    for (const letter of chosen) {
      const original = letter.dataset.letter ?? letter.textContent ?? ''
      if (!original.trim()) continue
      let ticks = 0

      const spin = window.setInterval(() => {
        letter.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        if (++ticks > 5) {
          window.clearInterval(spin)
          letter.textContent = original
        }
      }, SCRAMBLE_MS / 6)

      timers.push(spin)
      // le filet de securite : passe ce delai, la lettre est la bonne, quoi
      // qu'il arrive a l'intervalle
      const stop = window.setTimeout(() => {
        window.clearInterval(spin)
        letter.textContent = original
      }, SCRAMBLE_MS)
      timers.push(stop)
    }

    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [text])

  return (
    <Tag className={className} ref={ref}>
      {rendered}
    </Tag>
  )
}
