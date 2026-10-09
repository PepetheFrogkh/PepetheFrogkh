'use client'

import { useApp } from '@/lib/useAppStore'
import { SCENES } from '@/lib/scrollState'
import { BEERS } from '@/lib/brand'

/**
 * Jump straight to a beer, as in the wireframe. Lite is listed but disabled:
 * it is not in the film, and a dead-end button is more honest than a plan
 * that is not there.
 */
export default function BeerSelector() {
  const scene = useApp((s) => s.scene)
  const requestJump = useApp((s) => s.requestJump)
  const current = SCENES[scene]?.id
  const lagerPlans = ['condensation', 'open', 'pour']

  return (
    <div className="selector" role="group" aria-label="Jump to a beer">
      {BEERS.map((b) => (
        <button
          key={b.id}
          type="button"
          disabled={!b.inFilm}
          title={b.inFilm ? undefined : `${b.name} ships with the full site`}
          onClick={() => b.inFilm && requestJump(b.id)}
          aria-current={
            b.id === 'lager'
              ? lagerPlans.includes(current ?? '')
              : b.id === current
          }
        >
          {b.name.replace('Hanuman ', '').replace('Premium ', '')}
        </button>
      ))}
    </div>
  )
}
