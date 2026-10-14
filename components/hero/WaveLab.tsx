'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import WaveStill from './WaveStill'
import { DESKTOP_COUNT, MOBILE_COUNT } from './wave'

/**
 * L'en-tete « la vague », sur sa route de test.
 *
 * Le texte est dans le HTML et s'affiche tout de suite ; la scene est importee
 * ensuite, sans rendu serveur, et le canvas est decoratif.
 *
 * La page fait trois ecrans de haut : la progression vaut 0 en haut et 1 a la
 * fin du deuxieme ecran, comme sur le site.
 *
 * Il n'y a jamais de zone blanche. L'image fixe en CSS est dessous des le
 * premier octet ; elle s'efface quand la scene a dessine sa premiere image, et
 * revient si WebGL manque ou si la machine n'arrive pas a suivre. Hors de
 * l'ecran, la boucle s'arrete : la carte graphique se repose.
 *
 * Le lecteur de mise au point (progression, images par seconde, nombre de
 * points) ne s'affiche qu'avec `?debug=1`. Avec `?fps=0` le garde-fou des
 * 30 i/s est desarme : c'est ce qu'il faut pour regarder la scene sur une
 * machine sans carte graphique, ou elle cederait la place a l'image fixe en
 * deux secondes.
 */

const Scene = dynamic(() => import('./WaveScene'), { ssr: false })

/** Vrai quand le navigateur sait ouvrir un contexte WebGL. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** Sous ce seuil soutenu, la scene cede la place a l'image fixe. */
const FPS_FLOOR = 30

export default function HeroLab() {
  const progressRef = useRef(0)
  /** L'etendue ou l'en-tete est actif : c'est elle qu'on observe, pas le
      canvas, qui est fixe et donc toujours a l'ecran. */
  const rangeRef = useRef<HTMLDivElement>(null)
  const [readout, setReadout] = useState({ progress: 0, fps: 0 })
  const [ready, setReady] = useState(false)
  const [painted, setPainted] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [still, setStill] = useState(false)
  const [paused, setPaused] = useState(false)
  const [debug, setDebug] = useState(false)
  /** Pourquoi la scene a rendu la main, s'il y a lieu. */
  const [fallback, setFallback] = useState<'' | 'webgl' | 'fps'>('')

  const onPainted = useCallback(() => setPainted(true), [])

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 720px)').matches)
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const params = new URLSearchParams(window.location.search)
    setDebug(params.get('debug') === '1')
    const floor = params.get('fps') !== null ? Number(params.get('fps')) : FPS_FLOOR

    if (!hasWebGL()) {
      setFallback('webgl')
      return
    }

    const onScroll = () => {
      const span = window.innerHeight * 2
      progressRef.current = Math.max(0, Math.min(1, window.scrollY / span))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // hors de l'ecran, la boucle s'arrete
    let observer: IntersectionObserver | undefined
    if (rangeRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => setPaused(!entry.isIntersecting),
        { threshold: 0 },
      )
      observer.observe(rangeRef.current)
    }

    // la scene arrive apres le texte
    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => setReady(true), { timeout: 1800 })
        : window.setTimeout(() => setReady(true), 400)

    // le compteur d'images, qui sert aussi de garde-fou
    let frames = 0
    let last = performance.now()
    let raf = 0
    let slow = 0
    const start = last
    const tick = (now: number) => {
      frames++
      if (now - last >= 500) {
        const fps = Math.round((frames * 1000) / (now - last))
        setReadout({ progress: progressRef.current, fps })
        // deux secondes de chauffe avant de juger, puis trois demi-secondes
        // sous le seuil d'affilee : une seule image lente ne compte pas
        if (now - start > 2000) {
          slow = fps > 0 && fps < floor ? slow + 1 : 0
          if (slow >= 3) setFallback('fps')
        }
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
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

  const scene = ready && !fallback
  // l'image fixe tient la place tant que la scene n'a rien dessine
  const showStill = !scene || !painted

  return (
    <div className="lab lab--wave">
      <div className="lab__scene" aria-hidden="true">
        {/* l'image fixe : jamais de zone blanche, meme sans WebGL */}
        <div className="lab__still" data-shown={showStill}>
          <WaveStill />
        </div>

        {scene ? (
          <Scene
            progress={() => progressRef.current}
            mobile={mobile}
            still={still}
            paused={paused}
            onPainted={onPainted}
          />
        ) : null}
      </div>

      <div className="lab__range" ref={rangeRef}>
        <header className="lab__text">
          <div className="container">
            <div className="lab__copy">
              <span className="eyebrow">Laboratoire · en-tête</span>
              <h1 className="lab__title">
                On construit les outils qui font <em>tourner</em> votre entreprise.
              </h1>
              <p className="lead">
                Sites web, automatisations, applications métier : livrés vite, à prix affichés,
                par une équipe qui connaît votre métier.
              </p>
            </div>
          </div>
        </header>

        <div className="lab__spacer" />
      </div>

      {/* Un bloc apres l'en-tete, pour verifier ce qui se passe quand la scene
          quitte l'ecran : la boucle doit s'arreter. */}
      <section className="lab__after">
        <p className="lead">
          Fin de l&rsquo;en-tête. La suite de l&rsquo;accueil viendra ici, et la vague se met en
          pause dès qu&rsquo;elle quitte l&rsquo;écran.
        </p>
      </section>

      {debug ? (
        <footer className="lab__readout">
          <span>
            progression <b>{readout.progress.toFixed(2)}</b>
          </span>
          <span>
            images/s <b>{readout.fps}</b>
          </span>
          <span>
            points <b>{(mobile ? MOBILE_COUNT : DESKTOP_COUNT).toLocaleString('fr-FR')}</b>
          </span>
          <span>{still ? 'image fixe' : paused ? 'en pause' : 'animé'}</span>
          <span>
            rendu{' '}
            <b>
              {fallback === 'webgl'
                ? 'image fixe · pas de WebGL'
                : fallback === 'fps'
                  ? 'image fixe · moins de 30 i/s'
                  : painted
                    ? 'WebGL'
                    : 'en attente'}
            </b>
          </span>
        </footer>
      ) : null}
    </div>
  )
}
