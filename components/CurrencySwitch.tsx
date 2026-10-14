'use client'

import { useEffect, useState } from 'react'
import { CURRENCY_COOKIE, CURRENCY_MAX_AGE, DEFAULT_CURRENCY } from '@/lib/currency'
import { CURRENCIES, type Currency } from '@/lib/prices'
import { track } from '@/lib/analytics'

/** Le symbole de chaque devise, pour le bouton. */
const SYMBOL: Record<Currency, string> = { EUR: '€', USD: '$' }

/**
 * Le selecteur de devise, toujours visible dans l'en-tete.
 *
 * Il ne recharge pas la page : les deux devises sont deja dans le HTML, et cet
 * attribut sur la balise html decide laquelle se voit. Le choix est memorise
 * dans un cookie d'un an, que la detection par pays ne reecrit plus ensuite :
 * un choix explicite prime sur une detection.
 */
export default function CurrencySwitch({ label }: { label: string }) {
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY)

  // l'attribut est pose avant le premier affichage par le script du gabarit :
  // on le relit ici plutot que de le reecrire, pour ne pas clignoter
  useEffect(() => {
    const current = document.documentElement.dataset.currency
    if (current === 'EUR' || current === 'USD') setCurrency(current)
  }, [])

  const choose = (next: Currency) => {
    setCurrency(next)
    document.documentElement.dataset.currency = next
    document.cookie = `${CURRENCY_COOKIE}=${next};path=/;max-age=${CURRENCY_MAX_AGE};samesite=lax`
    track('currency_change', { currency: next })
  }

  return (
    <div className="currency" role="group" aria-label={label}>
      {CURRENCIES.map((value) => (
        <button
          className="currency__btn"
          type="button"
          key={value}
          aria-pressed={currency === value}
          onClick={() => choose(value)}
        >
          {SYMBOL[value]}
        </button>
      ))}
    </div>
  )
}
