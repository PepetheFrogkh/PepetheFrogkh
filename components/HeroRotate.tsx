'use client'

import { useEffect, useRef, useState } from 'react'
import { reduced } from '@/lib/motion'

/**
 * Le mot qui tourne dans le titre de l'accueil.
 *
 * « On construit » reste, et ce qui suit change : des sites web, des
 * automatisations, des applications metier. C'etait une section epinglee au
 * milieu de la page, ou personne ne la voyait avant d'avoir defile ; c'est
 * maintenant la premiere chose que le visiteur lit, et le titre y gagne d'etre
 * plus court.
 *
 * Le premier mot est dans le HTML et s'affiche tout de suite. Les suivants se
 * relaient toutes les 2,6 secondes, et les deux se croisent : le sortant monte
 * pendant que l'entrant arrive, donc la ligne n'est jamais vide. Le cahier
 * l'exige, et c'est aussi ce qui rend le geste lisible.
 *
 * En mouvement reduit, et sans JavaScript, le premier mot reste, point. Les
 * autres sont quand meme dans le HTML, caches aux yeux mais lus par un moteur
 * de recherche : ce sont les trois services du studio, ils ont leur place dans
 * la page.
 */

/** Combien de temps un mot reste affiche, en millisecondes. */
const HOLD = 2600

export default function HeroRotate({ words }: { words: string[] }) {
  const [at, setAt] = useState(0)
  const [live, setLive] = useState(false)
  /** Le mot qui s'en va, le temps que le croisement se joue. */
  const [leaving, setLeaving] = useState<number | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (reduced() || words.length < 2) return
    setLive(true)

    const step = () => {
      setAt((i) => {
        setLeaving(i)
        return (i + 1) % words.length
      })
      timer.current = window.setTimeout(step, HOLD)
    }
    timer.current = window.setTimeout(step, HOLD)

    return () => window.clearTimeout(timer.current)
  }, [words])

  return (
    <span className="rot" data-live={live || undefined}>
      {/* La plus longue des propositions tient la largeur : sans elle, la
          ligne se retrecit et s'elargit a chaque relais, et tout ce qui est
          pose en dessous sautille. Elle est invisible et hors de l'arbre
          d'accessibilite, elle ne sert qu'a mesurer. */}
      <span className="rot__gauge" aria-hidden="true">
        {words.reduce((long, word) => (word.length > long.length ? word : long), '')}
      </span>

      {words.map((word, i) => (
        <span
          className="rot__word"
          key={word}
          data-state={i === at ? 'in' : i === leaving ? 'out' : 'off'}
          aria-hidden={live && i !== at ? true : undefined}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
