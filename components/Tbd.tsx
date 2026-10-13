import type { Locale } from '@/lib/i18n'
import { TBD } from '@/content'

/**
 * L'emplacement visible de ce qui manque.
 *
 * Le cahier interdit d'inventer un chiffre, un logo, un temoignage ou un nom
 * de client. Tout ce qui n'a pas ete fourni passe par ici, pour qu'une
 * relecture voie le trou au lieu de lire une invention.
 */
export function Tbd({ locale, what }: { locale: Locale; what?: string }) {
  return (
    <span className="tbd">
      {TBD[locale]}
      {what ? ` ${what}` : ''}
    </span>
  )
}

export function TbdBlock({ locale, what }: { locale: Locale; what?: string }) {
  return (
    <div className="tbd-block">
      <Tbd locale={locale} what={what} />
    </div>
  )
}
