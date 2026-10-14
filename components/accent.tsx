import { Fragment, type ReactNode } from 'react'

/**
 * Le mot entre asterisques passe en italique.
 *
 * La convention vaut pour une partie de ligne et pas seulement pour une ligne
 * entiere : « qui font *tourner* » met un seul mot en valeur, au milieu de sa
 * ligne. La couleur vient du CSS de l'endroit ou le titre est pose, pas d'ici,
 * parce que l'en-tete typographique et la sequence ne la traitent pas pareil.
 *
 * Elle vivait en double, une fois dans `HeroType` et une fois ailleurs : deux
 * copies d'une convention d'ecriture finissent par diverger.
 */
export function accent(line: string, className?: string): ReactNode[] {
  return line.split('*').map((part, i) =>
    i % 2 === 1 ? (
      <em className={className} key={i}>
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}
