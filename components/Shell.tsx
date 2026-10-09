'use client'

import type { ReactNode } from 'react'
import { useApp } from '@/lib/useAppStore'
import { SCROLL_VH } from '@/lib/scrollState'
import Boot from './Boot'
import ScrollDriver from './ScrollDriver'
import FilmScrubber, { type FilmManifest } from './FilmScrubber'
import Overlay from './Overlay'
import Header from './Header'
import ProgressDrop from './ProgressDrop'
import BeerSelector from './BeerSelector'
import AgeGate from './AgeGate'
import Loader from './Loader'

/**
 * Decides which version of the page the visitor gets.
 *
 * `story` is the server-rendered narrative. With the film running it stays in
 * the document as screen-reader and crawler text; on `prefers-reduced-motion`
 * the same markup is simply shown over a single still. There is no WebGL path
 * any more and so no "your browser cannot do this" case — a canvas drawing
 * decoded JPEGs works everywhere.
 */
export default function Shell({
  story,
  manifest,
}: {
  story: ReactNode
  manifest: FilmManifest
}) {
  const reduced = useApp((s) => s.reducedMotion)
  const ageOk = useApp((s) => s.ageOk)

  return (
    <>
      <Boot />
      <Loader />
      <AgeGate />
      <Header />

      {reduced ? (
        <>
          <div className="still-layer" aria-hidden="true" />
          <main className="static" id="story">
            {story}
          </main>
        </>
      ) : (
        <>
          <FilmScrubber manifest={manifest} />
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
