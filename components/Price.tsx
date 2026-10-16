import type { Locale } from '@/lib/i18n'
import { formatFrom, formatPrice } from '@/lib/money'
import { CURRENCIES, type Price as PriceValue } from '@/lib/prices'
import { Tbf } from './Tbd'

/**
 * Un prix, dans les deux devises.
 *
 * Les deux montants sont dans le HTML, et un attribut sur la balise html
 * decide lequel se voit. C'est ce qui permet aux pages de rester statiques,
 * donc en cache chez l'hebergeur, tout en montrant le bon prix a chacun.
 *
 * Un montant qui n'a pas ete fixe dans une devise affiche l'emplacement
 * [À FIXER] dans cette devise seulement : l'autre reste lisible.
 */
export default function Price({
  price,
  locale,
  from = false,
  className,
}: {
  price: PriceValue
  locale: Locale
  /** « a partir de 499 € HT » plutot que « 499 € HT ». */
  from?: boolean
  className?: string
}) {
  return (
    <span className={['price', className].filter(Boolean).join(' ')}>
      {CURRENCIES.map((currency) => {
        const text = (from ? formatFrom : formatPrice)(price, currency, locale)
        return (
          <span data-cur={currency} key={currency}>
            {text === null ? <Tbf locale={locale} /> : text}
          </span>
        )
      })}
    </span>
  )
}
