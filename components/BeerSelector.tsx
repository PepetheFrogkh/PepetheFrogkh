'use client'

import { useApp } from '@/lib/useAppStore'
import { SCENES } from '@/lib/scrollState'

/**
 * Jump straight to a beer, as in the wireframe. Lite is in the line-up but
 * disabled: it is not in the three-day scope and a dead-end button is more
 * honest than an empty plan.
 */
export default function BeerSelector() {
  const scene = useApp((s) => s.scene)
  const requestJump = useApp((s) => s.requestJump)
  const current = SCENES[scene]?.id

  return (
    <div className="selector" role="group" aria-label="Jump to a beer">
      <button
        type="button"
        onClick={() => requestJump('lager')}
        aria-current={['condensation', 'open', 'pour'].includes(current ?? '')}
      >
        Lager
      </button>
      <button
        type="button"
        onClick={() => requestJump('black')}
        aria-current={current === 'black'}
      >
        Black
      </button>
      <button type="button" disabled title="Hanuman Lite ships with the full site">
        Lite
      </button>
    </div>
  )
}
