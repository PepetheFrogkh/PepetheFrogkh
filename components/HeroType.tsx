'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { reduced, small, useGsap } from '@/lib/motion'

/**
 * L'en-tete, typographique.
 *
 * Pas de visuel : le titre est le visuel. Il remplit l'ecran, et le defilement
 * le recompose au lieu de reveler quoi que ce soit.
 *
 * A l'arrivee, tout est deja la : l'etiquette, les quatre lignes, le
 * sous-titre, les deux boutons. Rien n'est cache, donc rien n'a besoin
 * d'apparaitre pour etre lu ou clique. Ce que le defilement fait, c'est vider
 * la composition par le haut : les trois premieres lignes montent et
 * s'effacent, tandis que la derniere grandit, se pose au centre et reste
 * seule, soulignee. Le pied de l'en-tete, lui, ne bouge pas : le bouton est
 * cliquable du premier au dernier pixel.
 *
 * La derniere ligne gagne aussi du `WONK` et du `SOFT`, les axes de Fraunces :
 * la lettre elle-meme change de caractere en grandissant. C'est le seul
 * endroit du site ou la police bouge.
 */
export default function HeroType({
  eyebrow,
  lines,
  children,
}: {
  eyebrow: string
  /** Le titre ligne par ligne ; la derniere porte les asterisques. */
  lines: string[]
  /** Le sous-titre, les boutons et la note. */
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced()) return

    const gsap = useGsap()
    const rows = [...node.querySelectorAll<HTMLElement>('.typo__line:not(.typo__line--last)')]
    const last = node.querySelector<HTMLElement>('.typo__shrink')
    const label = node.querySelector<HTMLElement>('.typo__eyebrow')
    const rule = node.querySelector<HTMLElement>('.typo__rule')
    if (!last) return

    const narrow = small()
    const title = node.querySelector<HTMLElement>('.typo__title')

    /** L'echelle deja appliquee, pour mesurer la largeur au repos. */
    const currentScale = () => {
      const m = new DOMMatrixReadOnly(getComputedStyle(last!).transform)
      return m.a || 1
    }

    /**
     * L'echelle de la derniere ligne et sa remontee sont mesurees sur la mise
     * en page reelle : « Mesurez-la. » et « Measure it. » n'ont pas la meme
     * largeur, et une valeur en dur deborderait dans une langue ou dans
     * l'autre.
     */
    const geometry = () => {
      const room = (title?.clientWidth ?? node.clientWidth) * (narrow ? 0.98 : 0.94)
      // la largeur du texte, pas celle du bloc de ligne : le bloc remplit le
      // conteneur et l'echelle calculee retomberait toujours a son minimum
      const width = last.getBoundingClientRect().width / currentScale() || 1
      const scale = Math.max(1.05, Math.min(narrow ? 1.3 : 1.9, room / width))
      // la phrase vient se poser a la place de la premiere ligne
      const row = last.closest<HTMLElement>('.typo__line')
      const rise = title && row ? row.offsetTop - title.offsetTop : 0
      return { scale, rise }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          end: () => `+=${narrow ? 110 : 150}%`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // l'etiquette s'en va la premiere
      if (label) tl.to(label, { autoAlpha: 0, y: -24, ease: 'none' }, 0)

      // les trois premieres lignes montent et s'effacent, chacune a son
      // rythme : la composition se vide du haut vers le bas
      rows.forEach((row, i) => {
        tl.to(
          row,
          { yPercent: -110, autoAlpha: 0, ease: 'none' },
          i * 0.12,
        )
      })

      // la derniere ligne grandit et se pose au centre. L'echelle est une
      // transformation, pas une taille de police : animer font-size
      // recalculerait la mise en page a chaque image.
      tl.to(
        last,
        {
          scale: () => geometry().scale,
          y: () => -geometry().rise,
          ease: 'none',
          '--wonk': 1,
          '--soft': 9,
        },
        0.1,
      )

      // le trait orange se tire sous la phrase, une fois qu'elle est posee
      if (rule) tl.to(rule, { scaleX: 1, ease: 'power2.out' }, 0.55)
    }, node)

    return () => ctx.revert()
  }, [lines.length])

  return (
    <section className="typo" ref={ref}>
      <div className="container typo__inner">
        <span className="eyebrow typo__eyebrow">{eyebrow}</span>

        <h1 className="typo__title">
          {lines.map((line, i) => {
            const accent = line.startsWith('*') && line.endsWith('*')
            const body = accent ? line.slice(1, -1) : line
            const isLast = i === lines.length - 1
            return (
              <span
                className={[
                  'typo__line',
                  accent ? 'typo__line--accent' : '',
                  isLast ? 'typo__line--last' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={line}
              >
                {/* le mot entre par un masque, du bas vers le haut : c'est le
                    cadre qui s'ouvre, le texte lui-meme est deja la */}
                {isLast ? (
                  /* un conteneur qui se resserre sur le texte : l'echelle part
                     de son coin gauche et le trait fait exactement sa largeur */
                  <span className="typo__shrink">
                    <span className="typo__word" style={{ animationDelay: `${i * 90}ms` }}>
                      {body}
                    </span>
                    <i className="typo__rule" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="typo__word" style={{ animationDelay: `${i * 90}ms` }}>
                    {body}
                  </span>
                )}
              </span>
            )
          })}
        </h1>

        <div className="typo__foot">{children}</div>
      </div>
    </section>
  )
}
