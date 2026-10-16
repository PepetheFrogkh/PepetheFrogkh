'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Le rideau d'ouverture : un fond creme et un compteur de 0 a 100.
 *
 * Deux garde-fous, parce qu'un rideau est la seule chose du site qui cache
 * volontairement le contenu.
 *
 * Le premier est dans la feuille de style : le rideau se leve tout seul, par
 * une animation CSS qui demarre a 800 ms et dure 400 ms, comptes depuis le
 * premier affichage. Il a donc disparu avant 1,5 s meme si le JavaScript ne
 * s'execute jamais, et il ne laisse aucun ecouteur de clic derriere lui.
 *
 * Le second est ici : des que la page est chargee, le compteur saute a 100 et
 * le rideau part sans attendre son heure. Le visiteur rapide n'attend pas le
 * visiteur lent.
 *
 * Le rideau est dans le HTML rendu par le serveur, pas ajoute apres coup :
 * sinon le contenu apparaitrait avant lui, ce qui est pire que pas de rideau
 * du tout. Et il n'existe pas quand le visiteur reduit les animations.
 */
export default function Preloader() {
  const [value, setValue] = useState(0)
  const [done, setDone] = useState(false)
  const node = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true)
      return
    }

    const start = performance.now()
    let frame = 0

    const lever = () => {
      // sans cela la boucle continue et fait reculer le compteur
      cancelAnimationFrame(frame)
      setValue(100)
      setDone(true)
    }

    const tick = (now: number) => {
      // L'horodatage d'une image peut preceder le `performance.now()` lu juste
      // avant, parce qu'il date du debut de l'image : sans ce plancher, le
      // compteur affiche une valeur negative a la premiere image.
      const elapsed = Math.max(0, now - start)
      // 0 a 100 en 800 ms, sauf si la page est prete avant
      setValue(Math.min(100, Math.round((elapsed / 800) * 100)))
      if (elapsed >= 800) {
        lever()
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const ready = () => {
      // une image au moins, pour que le compteur ne clignote pas a 0
      if (performance.now() - start > 240) lever()
    }
    if (document.readyState === 'complete') {
      window.setTimeout(ready, 260)
    } else {
      window.addEventListener('load', ready, { once: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('load', ready)
    }
  }, [])

  return (
    <div className="preloader" ref={node} data-done={done} aria-hidden="true">
      <span className="preloader__count">{value}</span>
    </div>
  )
}
