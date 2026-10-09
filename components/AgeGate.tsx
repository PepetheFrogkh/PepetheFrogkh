'use client'

import { useState } from 'react'
import { AGE_KEY, useApp } from '@/lib/useAppStore'
import DropIcon from './DropIcon'

/**
 * Legal gate. Stored in localStorage so it is asked once, as the brief
 * requires, and it blocks scrolling until it is answered.
 */
export default function AgeGate() {
  const ageOk = useApp((s) => s.ageOk)
  const setAgeOk = useApp((s) => s.setAgeOk)
  const [denied, setDenied] = useState(false)

  if (ageOk) return null

  const accept = () => {
    try {
      localStorage.setItem(AGE_KEY, 'yes')
    } catch {
      // nothing to do — they will be asked again next visit
    }
    setAgeOk(true)
  }

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate__inner">
        <span className="mark mark--wordmark gate__mark" role="img" aria-label="Hanuman" />
        <DropIcon className="gate__drop" />
        <h1 id="gate-title">Are you of legal drinking age?</h1>
        {denied ? (
          <p className="gate__denied">
            Thanks for stopping by. Come back when you are old enough to drink in your country.
          </p>
        ) : (
          <>
            <div className="gate__actions">
              <button className="btn" onClick={accept} type="button">
                Yes, I am
              </button>
              <button className="btn btn--ghost" onClick={() => setDenied(true)} type="button">
                No
              </button>
            </div>
            <p>
              Hanuman Beverages asks you to enjoy our beer responsibly. By entering you confirm you
              are of legal drinking age in your country of residence.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
