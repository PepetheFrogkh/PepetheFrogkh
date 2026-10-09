'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/useAppStore'

/**
 * A drop that fills while the first plan builds. The brief asks for the logo
 * line to animate; the drop is the same motif and reads at 44 px.
 */
export default function Loader() {
  const loaded = useApp((s) => s.loaded)
  const webgl = useApp((s) => s.webgl)
  const reduced = useApp((s) => s.reducedMotion)
  const [gone, setGone] = useState(false)
  const done = loaded || !webgl || reduced

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setGone(true), 900)
    return () => clearTimeout(t)
  }, [done])

  if (gone) return null

  return (
    <div className="loader" data-done={done} aria-hidden="true">
      <svg viewBox="0 0 26 34" fill="none">
        <defs>
          <clipPath id="drop-clip">
            <path d="M13 1.5C13 1.5 24 15.2 24 22.3 24 28.4 19.1 33 13 33S2 28.4 2 22.3C2 15.2 13 1.5 13 1.5Z" />
          </clipPath>
        </defs>
        <path
          d="M13 1.5C13 1.5 24 15.2 24 22.3 24 28.4 19.1 33 13 33S2 28.4 2 22.3C2 15.2 13 1.5 13 1.5Z"
          stroke="#d9a441"
          strokeWidth="1.2"
          fill="none"
        />
        <g clipPath="url(#drop-clip)">
          <rect x="0" y="34" width="26" height="34" fill="#d9a441">
            <animate
              attributeName="y"
              values="34;2;34"
              dur="2.2s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.6;1"
            />
          </rect>
        </g>
      </svg>
    </div>
  )
}
