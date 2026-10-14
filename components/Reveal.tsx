'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Apparition en fondu avec une montee de 12 px, au moment ou le bloc entre a
 * l'ecran.
 *
 * Trois regles du cahier tiennent ce composant.
 *
 * Le contenu est visible par defaut : l'attribut `data-shown` n'existe pas
 * tant que le composant n'est pas monte, et la feuille de style ne cache que
 * `data-shown="false"`. Sans JavaScript, ou si le script tombe, la page se lit
 * entierement.
 *
 * Le declenchement se fait a 15 % : soit 15 % du bloc est a l'ecran, soit son
 * haut a passe la ligne des 85 % de l'ecran, ce qui couvre aussi les blocs
 * plus hauts que l'ecran, dont 15 % ne sont jamais visibles d'un coup.
 *
 * Et le fondu dure 300 ms en tout, decalage compris : c'est la limite du
 * cahier, donc un defilement rapide ne laisse jamais un texte invisible
 * derriere lui. Un `delay` plus grand raccourcit d'autant la transition au
 * lieu de s'ajouter a elle.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  id,
}: {
  children: ReactNode
  delay?: number
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'ssr' | 'hidden' | 'shown'>('ssr')
  // le decalage et la transition tiennent ensemble dans les 300 ms du cahier
  const wait = Math.max(0, Math.min(delay, 80))

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setState('shown')
      return
    }

    // deja a l'ecran au chargement : on ne le cache pas pour le montrer apres
    const box = node.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) {
      setState('shown')
      return
    }

    setState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        const assez =
          entry.intersectionRatio >= 0.15 ||
          entry.boundingClientRect.top < window.innerHeight * 0.85
        if (!entry.isIntersecting || !assez) return
        setState('shown')
        observer.disconnect()
      },
      { threshold: [0, 0.15] },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-shown={state === 'ssr' ? undefined : String(state === 'shown')}
      style={{ transitionDelay: `${wait}ms`, transitionDuration: `${300 - wait}ms` }}
    >
      {children}
    </div>
  )
}
