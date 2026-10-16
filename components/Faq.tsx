'use client'

import { useState } from 'react'
import type { FaqItem } from '@/content'

/** Une seule reponse ouverte a la fois, comme le demande le cahier. */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="faq">
      {items.map((item, i) => {
        const shown = open === i
        return (
          <div className="faq__item" key={item.question}>
            <h3>
              <button
                className="faq__q"
                type="button"
                aria-expanded={shown}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(shown ? null : i)}
              >
                {item.question}
                <svg className="faq__sign" viewBox="0 0 24 24" aria-hidden="true">
                  <path className="icon" d="M5 12h14" />
                  {shown ? null : <path className="icon" d="M12 5v14" />}
                </svg>
              </button>
            </h3>
            <div id={`faq-${i}`} className="faq__a" hidden={!shown}>
              {item.answer}
            </div>
          </div>
        )
      })}
    </div>
  )
}
