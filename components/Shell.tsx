'use client'

import type { ReactNode } from 'react'
import { useApp } from '@/lib/useAppStore'
import { SCROLL_VH } from '@/lib/scrollState'
import Boot from './Boot'
import ScrollDriver from './ScrollDriver'
import Experience from './Experience'
import Overlay from './Overlay'
import Header from './Header'
import ProgressDrop from './ProgressDrop'
import BeerSelector from './BeerSelector'
import AgeGate from './AgeGate'
import Loader from './Loader'

/**
 * Decides which version of the page the visitor gets.
 *
 * `story` is the server-rendered narrative. When WebGL is available and the
 * visitor has not asked for reduced motion it stays in the document as
 * screen-reader/crawler text and the canvas does the talking; otherwise the
 * same markup is simply shown, which is the brief's static fallback — same
 * words, same order, no second copy to keep in sync.
 */
export default function Shell({ story }: { story: ReactNode }) {
  const webgl = useApp((s) => s.webgl)
  const reduced = useApp((s) => s.reducedMotion)
  const ageOk = useApp((s) => s.ageOk)
  const flat = !webgl || reduced

  return (
    <>
      <Boot />
      <Loader />
      <AgeGate />
      <Header />

      {flat ? (
        <main className="static" id="story">
          {story}
        </main>
      ) : (
        <>
          <Experience />
          {ageOk && (
            <>
              <ScrollDriver />
              <Overlay />
              <ProgressDrop />
              <BeerSelector />
              <div className="scroll-hint">Scroll</div>
              <div className="scroll-track" style={{ height: `${SCROLL_VH}vh` }} />
            </>
          )}
          <main className="sr-only" id="story">
            {story}
          </main>
        </>
      )}
    </>
  )
}
