'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { heroStage } from '@/lib/heroStage'
import { reduced, small, useGsap } from '@/lib/motion'

/**
 * L'en-tete, en quatre actes, menes par le defilement.
 *
 * Le manifeste du cahier est deja en trois temps : « L'experience client ne se
 * devine pas. Elle se mesure, et elle s'ameliore avec les bons outils. » Le
 * champ de particules les joue, et le defilement les enchaine :
 *
 *   0 · la ceinture de Kuiper    le titre et les boutons, rien d'autre
 *   1 · un nuage disperse        « ne se devine pas »
 *   2 · un histogramme           « elle se mesure »
 *   3 · trois cadres d'ecrans    « avec les bons outils »
 *
 * La section est epinglee le temps du recit, puis relachee. Le titre, le
 * sous-titre et les boutons ne bougent pas : ils restent lisibles du premier
 * au dernier acte. Seules les legendes changent, et chacune occupe la meme
 * place, donc rien ne saute.
 *
 * Quand le visiteur reduit les animations, il n'y a pas d'epinglage : les
 * legendes sont empilees et lisibles d'un coup, et le champ garde son image
 * fixe.
 */
export default function HeroStory({
  captions,
  field,
  children,
}: {
  /** Les propositions du manifeste, dans l'ordre : une par acte. */
  captions: string[]
  /** Le champ de particules, qui occupe tout l'en-tete. */
  field: ReactNode
  /** La colonne de texte : etiquette, titre, sous-titre, boutons. */
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const caps = [...node.querySelectorAll<HTMLElement>('.story__caption')]

    if (reduced()) {
      heroStage.value = 0
      caps.forEach((c) => {
        c.dataset.shown = 'true'
      })
      return
    }

    const gsap = useGsap()
    const acts = caps.length

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          // un ecran de defilement par acte, un peu moins sur mobile
          end: () => `+=${acts * (small() ? 85 : 110)}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            const stage = self.progress * acts
            heroStage.value = stage
            // la legende de l'acte en cours s'allume ; avant le premier acte,
            // aucune n'est allumee et l'en-tete est a nu
            const current = Math.round(stage)
            caps.forEach((c, i) => {
              c.dataset.shown = String(i + 1 === current)
            })
          },
        },
      })
    }, node)

    return () => {
      ctx.revert()
      heroStage.value = 0
    }
  }, [captions.length])

  return (
    <section className="hero story" ref={ref}>
      <div className="story__field" aria-hidden="true">
        {field}
      </div>

      <div className="container story__grid">
        <div className="story__text">{children}</div>
      </div>

      {/* Les legendes du recit, en bandeau bas : une seule ligne a la fois, et
          toujours a la meme place, pour ne rien faire sauter. Les trois sont
          dans le HTML, donc lues par un moteur de recherche et par un lecteur
          d'ecran ; c'est l'opacite qui designe celle de l'acte courant. */}
      <ol className="story__captions">
        {captions.map((caption, i) => (
          <li className="story__caption" key={caption} data-shown={false}>
            <span className="container story__caption-inner">
              <span className="story__act">{String(i + 1).padStart(2, '0')}</span>
              {caption}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
