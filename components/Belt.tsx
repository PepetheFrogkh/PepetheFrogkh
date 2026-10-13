'use client'

import { useEffect, useState, lazy, Suspense } from 'react'

const ParticleBelt = lazy(() => import('./ParticleBelt'))

/**
 * La ceinture est chargee apres le texte.
 *
 * Le cahier demande que le contenu principal s'affiche en moins de 2,5
 * secondes sur mobile, et que la ceinture arrive ensuite. Elle n'est donc ni
 * rendue sur le serveur ni dans le bundle de la page : elle est importee
 * quand le navigateur n'a plus rien d'urgent a faire.
 */
export default function Belt({ label }: { label: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 400)

    return () => {
      if (typeof window.cancelIdleCallback === 'function' && typeof idle === 'number') {
        window.cancelIdleCallback(idle)
      } else {
        clearTimeout(idle as number)
      }
    }
  }, [])

  return (
    <div className="belt" aria-hidden={false}>
      {ready ? (
        <Suspense fallback={null}>
          <ParticleBelt label={label} />
        </Suspense>
      ) : null}
    </div>
  )
}
