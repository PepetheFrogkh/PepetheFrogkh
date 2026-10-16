import type { Locale } from '@/lib/i18n'
import type { Price as PriceValue } from '@/lib/prices'
import Price from './Price'

export interface Row {
  id: string
  name: string
  detail?: string
  price: PriceValue
  /** La ligne mise en avant dans le tableau. */
  featured?: boolean
}

/**
 * Un tableau de prix.
 *
 * Une vraie table, pas une grille de div : ce sont des lignes de prix, un
 * lecteur d'ecran doit pouvoir les annoncer comme telles et sauter de l'une a
 * l'autre. Les montants viennent de `lib/prices.ts` et les libelles de
 * `content/`, indexes par le meme identifiant.
 */
export default function PriceTable({
  locale,
  caption,
  note,
  rows,
}: {
  locale: Locale
  caption: string
  note?: string
  rows: Row[]
}) {
  return (
    <div className="prices">
      <table className="prices__table">
        <caption className="prices__caption">
          {caption}
          {note ? <span className="prices__note">{note}</span> : null}
        </caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-featured={row.featured || undefined}>
              <th scope="row">
                <span className="prices__name">{row.name}</span>
                {row.detail ? <span className="prices__detail">{row.detail}</span> : null}
              </th>
              <td>
                <Price price={row.price} locale={locale} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
