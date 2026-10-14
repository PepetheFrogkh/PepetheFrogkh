'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { CAMERA, CARD_X, CARDS, DESKTOP_COUNT, MOBILE_COUNT } from './layout'

/**
 * L'en-tete « le tableur qui se range », sur sa route de test.
 *
 * Le texte est dans le HTML et s'affiche tout de suite ; la scene est importee
 * ensuite, sans rendu serveur, et le canvas est decoratif.
 *
 * La page fait trois ecrans de haut : la progression vaut 0 en haut et 1 a la
 * fin du deuxieme ecran, comme sur le site.
 */

const Scene = dynamic(() => import('./SpreadsheetScene'), { ssr: false })

/** L'abscisse d'une carte a l'ecran, en pourcentage, depuis la camera. */
function cardLeft(worldX: number, aspect: number): number {
  const halfHeight = Math.tan(((CAMERA.fov / 2) * Math.PI) / 180) * CAMERA.z
  const halfWidth = halfHeight * aspect
  return 50 + (worldX / halfWidth) * 50
}

export default function HeroLab() {
  const progressRef = useRef(0)
  const [readout, setReadout] = useState({ progress: 0, fps: 0 })
  const [aspect, setAspect] = useState(16 / 9)
  const [ready, setReady] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [still, setStill] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 720px)').matches)
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const onResize = () => setAspect(window.innerWidth / window.innerHeight)
    onResize()

    const onScroll = () => {
      const span = window.innerHeight * 2
      progressRef.current = Math.max(0, Math.min(1, window.scrollY / span))
    }
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // la scene arrive apres le texte
    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => setReady(true), { timeout: 1800 })
        : window.setTimeout(() => setReady(true), 400)

    // le lecteur : progression et images par seconde
    let frames = 0
    let last = performance.now()
    let raf = 0
    const tick = (now: number) => {
      frames++
      if (now - last >= 500) {
        setReadout({ progress: progressRef.current, fps: Math.round((frames * 1000) / (now - last)) })
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      if (typeof window.cancelIdleCallback === 'function' && typeof idle === 'number') {
        window.cancelIdleCallback(idle)
      } else {
        clearTimeout(idle as number)
      }
    }
  }, [])

  // les noms des cartes n'ont de sens qu'une fois les cartes formees
  const labels = Math.max(0, Math.min(1, (readout.progress - 0.62) / 0.3))

  return (
    <div className="lab">
      <div className="lab__scene" aria-hidden="true">
        {ready ? <Scene progress={() => progressRef.current} mobile={mobile} still={still} /> : null}

        {/* Les noms des cartes sont du HTML pose par-dessus la scene, pas de la
            geometrie : le texte reste net a toutes les densites. */}
        <div className="lab__labels" style={{ opacity: labels }}>
          {CARDS.map((name, i) => (
            <span
              className="lab__label"
              key={name}
              style={{ left: `${cardLeft(CARD_X[i], aspect)}%` }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <header className="lab__text">
        <div className="container">
          <span className="eyebrow">Laboratoire · en-tête</span>
          <h1 className="lab__title">
            Ce qui coince chaque semaine dans votre entreprise,{' '}
            <em>on le règle</em>.
          </h1>
          <p className="lead" style={{ maxWidth: '46ch' }}>
            Tableurs, messageries, tâches répétitives : on les remplace par des outils sur mesure
            que vos équipes utilisent vraiment. Module par module, en commençant par le plus urgent.
          </p>
        </div>
      </header>

      <div className="lab__spacer" />

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
      </footer>
    </div>
  )
}
