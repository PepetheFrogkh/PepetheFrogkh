'use client'

import { Fragment, useEffect, useRef } from 'react'
import { TRIGGER, reduced, useGsap } from '@/lib/motion'

/**
 * Un titre qui glisse ligne par ligne dans un masque.
 *
 * Le serveur rend le titre mot par mot, en texte simple : sans JavaScript, et
 * en mouvement reduit, il se lit tel quel. Au montage, les mots sont regroupes
 * par ligne, telles que le navigateur les a reellement coupees, et chaque
 * ligne recoit son masque. Regrouper apres coup est le seul moyen d'avoir les
 * vraies lignes : elles dependent de la largeur, de la langue et de la police.
 *
 * L'ensemble tient dans les 300 ms du cahier : 260 ms par ligne, 20 ms de
 * decalage, soit 300 ms pour la troisieme. Un titre deja a l'ecran au
 * chargement n'est pas masque du tout.
 */

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span'

export default function SplitHeading({
  text,
  as: Tag = 'h2',
  className,
  id,
}: {
  text: string
  as?: Tag
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return

    const words = [...node.querySelectorAll<HTMLElement>('.sh__w')]
    if (words.length === 0) return

    // ── regrouper les mots par ligne, d'apres leur position reelle ─────────
    const lines: HTMLElement[][] = []
    let top: number | null = null
    for (const word of words) {
      const at = Math.round(word.offsetTop)
      if (top === null || Math.abs(at - top) > 4) {
        lines.push([])
        top = at
      }
      lines[lines.length - 1].push(word)
    }

    // ── reconstruire : un masque par ligne ─────────────────────────────────
    const fragment = document.createDocumentFragment()
    const inners: HTMLElement[] = []
    for (const line of lines) {
      const outer = document.createElement('span')
      outer.className = 'sh__line'
      const inner = document.createElement('span')
      inner.className = 'sh__inner'
      line.forEach((word, i) => {
        if (i > 0) inner.append(' ')
        inner.append(word)
      })
      outer.append(inner)
      fragment.append(outer)
      inners.push(inner)
    }
    node.replaceChildren(fragment)

    const box = node.getBoundingClientRect()
    const seen = box.top < window.innerHeight && box.bottom > 0

    const gsap = useGsap()
    const ctx = gsap.context(() => {
      if (seen) return
      gsap.set(inners, { yPercent: 102 })
      gsap.to(inners, {
        yPercent: 0,
        duration: 0.26,
        stagger: 0.02,
        ease: 'power2.out',
        scrollTrigger: { trigger: node, start: TRIGGER, once: true },
      })
    }, node)

    return () => ctx.revert()
  }, [text])

  // « Les prix sont *affiches*. » : le mot entre asterisques porte l'accent,
  // et il le porte sur le mot lui-meme, pas sur un conteneur, pour que le
  // regroupement par ligne n'ait rien a demonter.
  const pieces = text.split(/(\*[^*]+\*)/).filter(Boolean)
  let key = 0

  return (
    <Tag className={['sh', className].filter(Boolean).join(' ')} id={id} ref={ref}>
      {pieces.flatMap((piece) => {
        const marked = piece.startsWith('*') && piece.endsWith('*')
        const body = marked ? piece.slice(1, -1) : piece
        return body
          .split(/\s+/)
          .filter(Boolean)
          .flatMap((word, i) => [
            // l'espace est un noeud a part : sans lui le titre se lit
            // « Cequenousfaisons » quand le JavaScript ne tourne pas
            ...(i > 0 ? [<Fragment key={key++}> </Fragment>] : []),
            <span className={`sh__w${marked ? ' accent' : ''}`} key={key++}>
              {word}
            </span>,
          ])
      })}
    </Tag>
  )
}
