'use client'

import { useEffect, useRef, useState } from 'react'
import { reduced, useGsap } from '@/lib/motion'
import type { Locale } from '@/lib/i18n'
import { Tbd } from './Tbd'

/**
 * La carte video qui s'agrandit jusqu'au plein ecran.
 *
 * Section epinglee : la carte part de sa taille de carte, occupe tout l'ecran
 * au milieu du defilement, puis se reduit. La video est muette, sans boucle
 * visible d'interface, et n'est chargee que quand la section approche de
 * l'ecran : avant, il n'y a que son affiche.
 *
 * Sans video fournie, la carte affiche son emplacement et ne s'epingle pas :
 * une section epinglee vide n'aurait rien a montrer.
 *
 * En mouvement reduit, pas d'epinglage et pas de lecture : l'affiche seule.
 */
export default function VideoCard({
  locale,
  src,
  poster,
  label,
}: {
  locale: Locale
  src: string | null
  poster: string | null
  label: string
}) {
  const section = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const node = section.current
    if (!node || !src) return

    // la video n'est chargee que quand la section approche
    let observer: IntersectionObserver | undefined
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setNear(entry.isIntersecting)
          const el = video.current
          if (!el) return
          if (entry.isIntersecting && !reduced()) void el.play().catch(() => {})
          else el.pause()
        },
        { rootMargin: '200px 0px' },
      )
      observer.observe(node)
    } else {
      setNear(true)
    }

    let revert: (() => void) | undefined
    if (!reduced()) {
      const gsap = useGsap()
      const ctx = gsap.context(() => {
        const frame = node.querySelector('.vcard__frame')
        if (!frame) return
        gsap
          .timeline({
            scrollTrigger: {
              trigger: node,
              start: 'top top',
              end: '+=160%',
              pin: true,
              scrub: 0.4,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          // elle s'ouvre jusqu'au plein cadre, puis se referme
          .fromTo(
            frame,
            { width: '62%', height: '58%', borderRadius: 'var(--r-card)' },
            { width: '100%', height: '100%', borderRadius: 0, ease: 'none', duration: 1 },
          )
          .to(frame, { width: '62%', height: '58%', borderRadius: 'var(--r-card)', ease: 'none', duration: 1 })
      }, node)
      revert = () => ctx.revert()
    }

    return () => {
      observer?.disconnect()
      revert?.()
    }
  }, [src])

  return (
    <section className="vcard" ref={section}>
      <div className="vcard__frame">
        {src ? (
          near ? (
            <video
              ref={video}
              className="vcard__video"
              src={src}
              poster={poster ?? undefined}
              muted
              loop
              playsInline
              preload="none"
              aria-label={label}
            />
          ) : poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="vcard__video" src={poster} alt={label} />
          ) : null
        ) : (
          <div className="vcard__empty">
            <Tbd locale={locale} what={label} />
          </div>
        )}
      </div>
    </section>
  )
}
