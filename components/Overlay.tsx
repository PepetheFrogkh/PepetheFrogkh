'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useApp } from '@/lib/useAppStore'
import { PLANS, SOCIALS } from '@/lib/copy'

/**
 * All copy is HTML over the canvas, never drawn into the 3D — the brief is
 * explicit about it and it is the only way the page is indexable and
 * translatable. React only re-renders when the active plan changes, so this
 * costs nothing per frame.
 */
export default function Overlay() {
  const scene = useApp((s) => s.scene)
  const ageOk = useApp((s) => s.ageOk)
  const root = useRef<HTMLDivElement>(null)
  const prev = useRef(-1)

  useEffect(() => {
    if (!root.current || !ageOk) return
    const nodes = Array.from(root.current.querySelectorAll<HTMLElement>('.plan'))
    const ctx = gsap.context(() => {
      nodes.forEach((node, i) => {
        const active = i === scene
        const forward = scene > prev.current
        gsap.killTweensOf(node)
        gsap.killTweensOf(node.children)
        if (active) {
          gsap.set(node, { visibility: 'visible' })
          gsap.fromTo(
            node.children,
            { opacity: 0, y: forward ? 26 : -26, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.75,
              stagger: 0.07,
              ease: 'power3.out',
              overwrite: true,
            },
          )
          gsap.to(node, { opacity: 1, duration: 0.4, overwrite: true })
        } else {
          gsap.to(node, {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            overwrite: true,
            onComplete: () => gsap.set(node, { visibility: 'hidden' }),
          })
        }
      })
      prev.current = scene
    }, root)
    return () => ctx.revert()
  }, [scene, ageOk])

  return (
    <div className="overlay" ref={root}>
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`plan${plan.id === 'cta' ? ' plan--cta' : ''}`}
          data-plan={plan.plan}
        >
          <span className="plan__eyebrow">{plan.copy.eyebrow}</span>
          <h2 className="plan__title">{plan.copy.title}</h2>
          {plan.copy.sub && <p className="plan__sub">{plan.copy.sub}</p>}
          {plan.id === 'cta' && (
            <>
              <div className="cta-row">
                <a className="btn" href="#find">
                  Find a store
                </a>
                <a className="btn btn--ghost" href="#beers">
                  Our beers
                </a>
              </div>
              <div className="socials">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
