import type { Locale } from '@/lib/i18n'
import { TBD, TBF } from '@/content'

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

/**
 * L'emplacement d'un prix qui n'a pas ete fixe.
 *
 * Distinct de `Tbd` : il ne manque pas un contenu, il manque une decision. Et
 * surtout, il ne faut pas que le trou soit comble par une conversion calculee
 * depuis l'autre devise.
 */
export function Tbf({ locale }: { locale: Locale }) {
  return <span className="tbd tbd--fix">{TBF[locale]}</span>
}
