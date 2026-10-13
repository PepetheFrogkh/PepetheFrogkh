'use client'

import { useEffect, useState, lazy, Suspense } from 'react'

const ParticleField = lazy(() => import('./webgl/ParticleField'))

/**
 * Le champ de particules est charge apres le texte.
 *
 * Le cahier demande que le contenu principal s'affiche en moins de 2,5
 * secondes sur mobile et que le WebGL se charge ensuite. Three.js et le champ
 * ne sont donc ni rendus sur le serveur ni dans le bundle de la page : ils
 * sont importes quand le navigateur n'a plus rien d'urgent a faire.
 */
export default function Belt({ label }: { label: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2500 })
        : window.setTimeout(() => setReady(true), 600)

    return () => {
      if (typeof window.cancelIdleCallback === 'function' && typeof idle === 'number') {
        window.cancelIdleCallback(idle)
      } else {
        clearTimeout(idle as number)
      }
    }
  }, [])

  return (
    <div className="belt">
      {ready ? (
        <Suspense fallback={null}>
          <ParticleField label={label} />
        </Suspense>
      ) : null}
    </div>
  )
}
