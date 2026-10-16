'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import WaveStill from './WaveStill'

/**
 * La vague de l'en-tete d'accueil.
 *
 * La meme scene que la route de test `/lab/vague`, posee derriere le premier
 * ecran. Elle est decorative : tout le texte de l'en-tete est dans le HTML,
 * par-dessus, et lisible avant que le moindre point ne soit dessine. La nappe
 * occupe la bande basse du cadre, sous le bloc de texte, et jamais derriere
 * lui : le titre ne depend pas d'elle pour se lire.
 *
 * Il n'y a jamais de zone blanche a cet endroit. L'image fixe en CSS est
 * dessous des le premier octet ; elle s'efface quand la scene a dessine sa
 * premiere image, et reprend la main dans les quatre cas ou la scene se
 * retire : WebGL absent, machine qui n'arrive pas a suivre, mouvement reduit
 * demande par le visiteur, et economie de donnees.
 *
 * Hors de l'ecran, la boucle s'arrete : passe le premier ecran, la carte
 * graphique se repose.
 */

const Scene = dynamic(() => import('./WaveScene'), { ssr: false })

/**
 * Le fondu qui degage le texte, passe au nuanceur.
 *
 * Debut, fin, sens (0 horizontal, 1 vertical), opacite. La colonne de titre
 * s'arrete autour de 53 % de la fenetre a toutes les largeurs : le degre part
 * donc de 44 %. Sous 1 100 px le texte prend toute la largeur, il n'y a plus
 * de colonne libre a cote de lui : le fondu devient vertical et la nappe passe
 * a demi-opacite, parce que sur un telephone le bloc de texte descend jusqu'au
 * bas de l'ecran et la nappe doit y rester une texture.
 */
const WIDE: [number, number, number, number] = [0.44, 0.76, 0, 1]
const NARROW: [number, number, number, number] = [0.7, 0.94, 1, 0.5]

/** Vrai quand le navigateur sait ouvrir un contexte WebGL. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Sous ce seuil soutenu, la scene cede la place a l'image fixe.
 *
 * Trente images par seconde : en dessous, la houle devient saccadee et une
 * houle saccadee est pire qu'une image fixe nette.
 */
const FPS_FLOOR = 30

export default function HeroWave() {
  const progress = useRef(0)
  const range = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [painted, setPainted] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [still, setStill] = useState(false)
  const [paused, setPaused] = useState(false)
  const [out, setOut] = useState(false)
  const [narrow, setNarrow] = useState(false)

  const onPainted = useCallback(() => setPainted(true), [])

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 720px)').matches)
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    // Le sens du fondu suit la largeur, et suit un redimensionnement : la
    // nappe ne doit pas rester en travers du texte parce que la fenetre a
    // retreci apres le chargement.
    const span = window.matchMedia('(max-width: 1100px)')
    const onSpan = () => setNarrow(span.matches)
    onSpan()
    span.addEventListener('change', onSpan)

    // Un visiteur qui demande l'economie de donnees ne recoit pas une scene :
    // ce n'est pas le poids qui pese ici, c'est la batterie, et les deux vont
    // ensemble sur un telephone en itinerance.
    const saver = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData
    if (!hasWebGL() || saver) {
      setOut(true)
      return
    }

    /** 0 en haut de page, 1 a la fin du deuxieme ecran. */
    const onScroll = () => {
      const span = window.innerHeight * 2
      progress.current = Math.max(0, Math.min(1, window.scrollY / span))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    let observer: IntersectionObserver | undefined
    if (range.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), {
        threshold: 0,
      })
      observer.observe(range.current)
    }

    // la scene arrive apres le texte, jamais avant
    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => setReady(true), { timeout: 1800 })
        : window.setTimeout(() => setReady(true), 400)

    // le compteur d'images, qui sert de garde-fou
    let frames = 0
    let last = performance.now()
    let slow = 0
    const start = last
    let raf = requestAnimationFrame(function tick(now: number) {
      frames++
      if (now - last >= 500) {
        const fps = Math.round((frames * 1000) / (now - last))
        // deux secondes de chauffe avant de juger, puis trois demi-secondes
        // sous le seuil d'affilee : une seule image lente ne compte pas
        if (now - start > 2000) {
          slow = fps > 0 && fps < FPS_FLOOR ? slow + 1 : 0
          if (slow >= 3) setOut(true)
        }
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    })

    return () => {
      span.removeEventListener('change', onSpan)
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
      cancelAnimationFrame(raf)
      if (typeof window.cancelIdleCallback === 'function' && typeof idle === 'number') {
        window.cancelIdleCallback(idle)
      } else {
        clearTimeout(idle as number)
      }
    }
  }, [])

  const scene = ready && !out
  const showStill = !scene || !painted

  return (
    <div className="typo__wave" ref={range} aria-hidden="true">
      {/* l'image fixe : jamais de zone blanche, meme sans WebGL */}
      <div className="typo__still" data-shown={showStill}>
        <WaveStill />
      </div>

      {scene ? (
        <Scene
          progress={() => progress.current}
          mobile={mobile}
          still={still}
          paused={paused}
          mask={narrow ? NARROW : WIDE}
          onPainted={onPainted}
        />
      ) : null}
    </div>
  )
}
