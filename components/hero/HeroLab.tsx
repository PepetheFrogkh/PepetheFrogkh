'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import HeroPanel from '../HeroPanel'
import {
  CARDS,
  CARD_H,
  CARD_W,
  CARD_Y,
  DESKTOP_COUNT,
  MOBILE_COUNT,
  viewHalf,
} from './layout'

/**
 * L'en-tete « le tableur qui se range », sur sa route de test.
 *
 * Le texte est dans le HTML et s'affiche tout de suite ; la scene est importee
 * ensuite, sans rendu serveur, et le canvas est decoratif. Elle occupe la
 * moitie droite de l'ecran sur grand ecran, le bas de l'ecran sur mobile : le
 * texte garde sa place et les cellules ne passent jamais dessous.
 *
 * La page fait trois ecrans de haut : la progression vaut 0 en haut et 1 a la
 * fin du deuxieme ecran, comme sur le site.
 *
 * Il n'y a jamais de zone blanche. L'image fixe, les memes trois cartes en
 * CSS, est dessous des le premier octet ; elle s'efface quand la scene a
 * dessine sa premiere image, et revient si WebGL manque ou si la machine
 * n'arrive pas a suivre.
 *
 * Le lecteur de mise au point (progression, images par seconde, nombre de
 * cellules) ne s'affiche qu'avec `?debug=1`. Avec `?debug=1&fps=0` le
 * garde-fou des 30 i/s est desarme : c'est ce qu'il faut pour regarder la
 * scene sur une machine sans carte graphique, ou elle cederait la place a
 * l'image fixe en deux secondes.
 */

const Scene = dynamic(() => import('./SpreadsheetScene'), { ssr: false })

/** Vrai quand le navigateur sait ouvrir un contexte WebGL. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

/** Sous ce seuil soutenu, la scene cede la place a l'image fixe. */
const FPS_FLOOR = 30

export default function HeroLab() {
  const progressRef = useRef(0)
  const [readout, setReadout] = useState({ progress: 0, fps: 0 })
  const [aspect, setAspect] = useState(0.9)
  const [ready, setReady] = useState(false)
  const [painted, setPainted] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [still, setStill] = useState(false)
  const [debug, setDebug] = useState(false)
  /** Pourquoi la scene a rendu la main, s'il y a lieu. */
  const [fallback, setFallback] = useState<'' | 'webgl' | 'fps'>('')

  const onPainted = useCallback(() => setPainted(true), [])

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 720px)').matches)
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const params = new URLSearchParams(window.location.search)
    const inspect = params.get('debug') === '1'
    setDebug(inspect)
    // le seuil, abaissable seulement en mise au point
    const floor = inspect && params.get('fps') !== null ? Number(params.get('fps')) : FPS_FLOOR

    if (!hasWebGL()) {
      setFallback('webgl')
      return
    }

    // le rapport du cadre de la scene, pas celui de la fenetre
    const frame = () => {
      const node = document.querySelector('.lab__scene')
      if (!node) return
      const box = node.getBoundingClientRect()
      if (box.height > 0) setAspect(box.width / box.height)
    }
    frame()

    const onScroll = () => {
      const span = window.innerHeight * 2
      progressRef.current = Math.max(0, Math.min(1, window.scrollY / span))
    }
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', frame)

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
      window.removeEventListener('resize', frame)
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

  // les noms des cartes n'ont de sens qu'une fois les cartes formees
  const labels = scene && painted ? Math.max(0, Math.min(1, (readout.progress - 0.62) / 0.3)) : 0
  const half = viewHalf(aspect)

  return (
    <div className="lab">
      <div className="lab__scene" aria-hidden="true">
        {/* l'image fixe : jamais de zone blanche, meme sans WebGL */}
        <div className="lab__still" data-shown={showStill}>
          <HeroPanel />
        </div>

        {scene ? (
          <Scene
            progress={() => progressRef.current}
            mobile={mobile}
            still={still}
            onPainted={onPainted}
          />
        ) : null}

        {/* Les noms des cartes sont du HTML pose par-dessus la scene, pas de la
            geometrie : le texte reste net a toutes les densites. */}
        <div className="lab__labels" style={{ opacity: labels }}>
          {CARDS.map((name, i) => (
            <span
              className="lab__label"
              key={name}
              style={{
                // la carte est centree en x : son bord gauche sert de repere
                left: `${50 - (CARD_W / 2 / half.w) * 50}%`,
                top: `${50 - ((CARD_Y[i] + CARD_H / 2 + 0.1) / half.h) * 50}%`,
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <header className="lab__text">
        <div className="container">
          <div className="lab__copy">
            <span className="eyebrow">Laboratoire · en-tête</span>
            <h1 className="lab__title">
              Ce qui coince chaque semaine dans votre entreprise, <em>on le règle</em>.
            </h1>
            <p className="lead">
              Tableurs, messageries, tâches répétitives : on les remplace par des outils sur mesure
              que vos équipes utilisent vraiment. Module par module, en commençant par le plus
              urgent.
            </p>
          </div>
        </div>
      </header>

      <div className="lab__spacer" />

      {debug ? (
        <footer className="lab__readout">
          <span>
            progression <b>{readout.progress.toFixed(2)}</b>
          </span>
          <span>
            images/s <b>{readout.fps}</b>
          </span>
          <span>
            cellules <b>{mobile ? MOBILE_COUNT : DESKTOP_COUNT}</b>
          </span>
          <span>{still ? 'image fixe' : 'animé'}</span>
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
