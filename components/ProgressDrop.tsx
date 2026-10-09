'use client'

import { useEffect, useRef } from 'react'
import { scroll } from '@/lib/scrollState'
import DropIcon from './DropIcon'

/**
 * The drop-shaped scroll rail from the wireframe. Driven by its own rAF
 * writing a style directly — putting scroll progress through React state
 * would re-render the tree every frame for a 3px bar.
 */
export default function ProgressDrop() {
  const fill = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    let last = -1
    const tick = () => {
      const v = Math.round(scroll.progress * 1000) / 10
      if (v !== last && fill.current) {
        fill.current.style.height = `${v}%`
        last = v
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="progress" aria-hidden="true">
      <DropIcon className="progress__drop" />
      <div className="progress__rail">
        <div className="progress__fill" ref={fill} />
      </div>
      <span className="progress__label">Scroll</span>
    </div>
  )
}
