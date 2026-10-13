'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { resolve } from '@/lib/links'
import { track, type TrackedEvent } from '@/lib/analytics'
import { Tbd } from './Tbd'

/**
 * Un bouton ou un lien du cahier.
 *
 * Quand la cible n'a pas ete fournie, par exemple le lien de reservation, le
 * bouton reste visible mais inerte et porte l'emplacement [À FOURNIR] : le
 * trou se voit, et aucun visiteur ne clique dans le vide.
 */
export default function Cta({
  locale,
  href,
  label,
  variant = 'primary',
  event,
  small = false,
}: {
  locale: Locale
  href: string
  label: string
  variant?: 'primary' | 'secondary' | 'link'
  event?: TrackedEvent
  small?: boolean
}) {
  const target = resolve(locale, href)
  const className =
    variant === 'link'
      ? 'link-more'
      : ['btn', `btn--${variant}`, small ? 'btn--small' : ''].filter(Boolean).join(' ')

  if (!target) {
    return (
      <span className={className} aria-disabled="true">
        {label} <Tbd locale={locale} />
      </span>
    )
  }

  const onClick = event ? () => track(event) : undefined
  const external = target.startsWith('http') || target.startsWith('mailto:')

  if (external) {
    return (
      <a
        className={className}
        href={target}
        onClick={onClick}
        {...(target.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    )
  }

  return (
    <Link className={className} href={target} onClick={onClick}>
      {label}
    </Link>
  )
}
