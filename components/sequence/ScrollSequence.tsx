'use client'

import { useEffect, useRef, useState } from 'react'
import { reduced, small, useGsap } from '@/lib/motion'
import {
  CONCURRENCY,
  DESKTOP,
  EAGER,
  MOBILE,
  PROVIDED,
  type SequenceSet,
  frameUrl,
  density,
  pick,
} from './sequence'

/**
 * La sequence cinematique au defilement.
 *
 * Une animation 3D precalculee, dessinee image par image sur un canvas selon
 * la progression du defilement, dans une section epinglee. Le canvas est
 * decoratif : tout le texte est dans le HTML, par-dessus, et il est lisible
 * avant que la premiere image ne soit chargee.
 *
 * Le chargement est progressif. Les dix premieres images partent en premier ;
 * des que la premiere est decodee, elle est dessinee et la section devient
 * utilisable. Le reste arrive derriere, six images a la fois. Tant qu'une
 * image manque, c'est la plus proche deja chargee qui est dessinee : la
 * sequence est grossiere au debut, jamais vide.
 *
 * Quand le visiteur reduit les animations, il n'y a ni epinglage ni
 * defilement : une seule image, celle du milieu.
 */
export default function ScrollSequence({
  eyebrow,
  title,
  lead,
  /**
   * Le niveau du titre. L'accueil a deja son h1, le titre typographique du
   * premier ecran : la sequence y est une section, donc un h2. Le laboratoire
   * n'a qu'elle, donc un h1. Deux h1 sur une page desorientent un lecteur
   * d'ecran, qui s'en sert pour savoir de quoi parle la page.
   */
  level = 'h1',
}: {
  eyebrow: string
  title: React.ReactNode
  lead: string
  level?: 'h1' | 'h2'
}) {
  const Title = level
  const section = useRef<HTMLElement>(null)
  /**
   * L'enveloppe que ScrollTrigger epingle.
   *
   * Il ne faut surtout pas lui laisser epingler la `<section>` elle-meme :
   * epingler un element l'enveloppe dans un `pin-spacer` insere dans le DOM,
   * et le parent reel de la section cesse d'etre celui que React a note. Au
   * demontage, React appelle `removeChild` sur l'ancien parent et le
   * navigateur repond « The node to be removed is not a child of this node ».
   * En epinglant un enfant, le `pin-spacer` reste a l'interieur de la section,
   * que React retire alors d'un bloc, avec tout ce qu'elle contient.
   */
  const pinned = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(0)
  const [total, setTotal] = useState(DESKTOP[0].frames)

  useEffect(() => {
    const node = section.current
    const surface = canvas.current
    if (!node || !surface) return

    /**
     * La definition se decide ici, une fois, sur la taille reelle du canvas.
     *
     * Un portable retine de 1440 points fait un canvas de 2880 pixels : les
     * images de 1920 y etaient etirees d'un tiers, et c'est ce flou que l'on
     * voyait. Le choix ne se refait pas au redimensionnement : changer de jeu
     * en cours de route rechargerait la sequence entiere pour un gain que
     * personne ne reclame.
     */
    const narrow = small()
    const box = surface.getBoundingClientRect()
    const ratio = density(narrow, window.devicePixelRatio)
    const set: SequenceSet = pick(narrow ? MOBILE : DESKTOP, Math.round(box.width * ratio))
    setTotal(set.frames)
    const still = reduced()

    const images: (HTMLImageElement | null)[] = new Array(set.frames).fill(null)
    const done = new Uint8Array(set.frames)
    let current = -1
    let alive = true

    const context = surface.getContext('2d', { alpha: false })
    if (!context) return

    /** Le canvas suit la taille de son cadre, a deux pixels par point au plus. */
    const resize = () => {
      const now = surface.getBoundingClientRect()
      surface.width = Math.round(now.width * ratio)
      surface.height = Math.round(now.height * ratio)
      const redraw = current
      current = -1
      if (redraw >= 0) paint(redraw)
    }

    /** L'image la plus proche de `index` qui soit deja chargee. */
    const nearest = (index: number): number => {
      if (done[index]) return index
      for (let step = 1; step < set.frames; step++) {
        if (index - step >= 0 && done[index - step]) return index - step
        if (index + step < set.frames && done[index + step]) return index + step
      }
      return -1
    }

    /** Dessine en « couvrir » : le sujet reste centre, les bords sont rognes. */
    const paint = (index: number) => {
      const at = nearest(index)
      if (at < 0 || at === current) return
      const image = images[at]
      if (!image) return
      current = at

      const cw = surface.width
      const ch = surface.height
      const scale = Math.max(cw / image.naturalWidth, ch / image.naturalHeight)
      const w = image.naturalWidth * scale
      const h = image.naturalHeight * scale
      context.fillStyle = '#FFF8F3'
      context.fillRect(0, 0, cw, ch)
      context.drawImage(image, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    const load = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = frameUrl(set, index)
        const finish = () => {
          if (!alive) return resolve()
          images[index] = image
          done[index] = 1
          setLoaded((n) => n + 1)
          if (index === 0) {
            resize()
            paint(0)
            setReady(true)
          }
          resolve()
        }
        image.onload = finish
        // une image manquante ne doit pas bloquer la file
        image.onerror = () => resolve()
      })

    /** Les premieres d'abord, le reste derriere, six a la fois. */
    const run = async () => {
      const head = Math.min(EAGER, set.frames)
      await Promise.all(Array.from({ length: head }, (_, i) => load(i)))
      if (!alive) return

      let next = head
      const worker = async () => {
        while (alive && next < set.frames) {
          const index = next++
          await load(index)
        }
      }
      await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    }

    void run()
    window.addEventListener('resize', resize)

    // ── le defilement ──────────────────────────────────────────────────────
    let revert: (() => void) | undefined
    if (!still) {
      const gsap = useGsap()
      const ctx = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top top',
            end: () => `+=${set.frames * 12}`,
            pin: pinned.current ?? undefined,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              paint(Math.round(self.progress * (set.frames - 1)))
            },
          },
        })
      }, node)
      revert = () => ctx.revert()
    } else {
      // une seule image, celle du milieu
      void load(Math.floor(set.frames / 2)).then(() => {
        resize()
        paint(Math.floor(set.frames / 2))
        setReady(true)
      })
    }

    return () => {
      alive = false
      window.removeEventListener('resize', resize)
      revert?.()
    }
  }, [])

  return (
    <section className="seq" ref={section}>
      <div className="seq__pin" ref={pinned}>
      <canvas className="seq__canvas" ref={canvas} data-ready={ready} aria-hidden="true" />

      {/* L'emplacement de la vraie animation. Il disparait quand PROVIDED
          passe a vrai, dans components/sequence/sequence.ts. */}
      {PROVIDED ? null : (
        <span className="seq__tbd tbd">[À FOURNIR] animation 3D précalculée</span>
      )}

      <div className="container seq__inner">
        <div className="seq__text">
          <span className="eyebrow">{eyebrow}</span>
          <Title className="seq__title">{title}</Title>
          <p className="lead seq__lead">{lead}</p>
        </div>
      </div>

      {/* Le chargement, en clair : la page est lisible pendant ce temps. */}
      <span className="seq__load" data-shown={loaded < total} aria-hidden="true">
        {loaded} / {total}
      </span>
      </div>
    </section>
  )
}
