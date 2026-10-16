'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { LOCALES, LOCALE_NAMES, type Locale } from '@/lib/i18n'
import { allPaths } from '@/lib/routes'

/**
 * Le selecteur de langue, en menu deroulant.
 *
 * A deux langues, un simple lien suffisait : il n'y avait qu'une destination.
 * A trois, il faut choisir, donc un menu.
 *
 * Chaque entree est un vrai lien vers la meme page dans l'autre langue, slug
 * compris : `allPaths` traduit l'adresse courante, donc
 * /fr/services/sites-web mene a /en/services/websites et non a l'accueil. Un
 * lien, et non un bouton qui navigue en JavaScript : il s'ouvre dans un nouvel
 * onglet, il se copie, et il fonctionne sans script.
 *
 * Chaque langue est ecrite dans sa propre langue, parce qu'un visiteur khmer
 * cherche « ភាសាខ្មែរ » et pas « Khmer ». Le bouton n'affiche que le code
 * court, faute de place dans l'en-tete, mais le nom complet est dans le menu
 * et dans l'etiquette du bouton.
 *
 * Mecanique reprise des menus Services et Expertises, pour que le clavier se
 * comporte pareil partout : `aria-expanded` sur le bouton, `aria-controls`
 * vers le panneau, fermeture a Echap avec retour du focus, et fermeture des
 * que le focus sort du groupe.
 */
export default function LangSwitch({
  locale,
  pathname,
  label,
}: {
  locale: Locale
  pathname: string
  /** « Langue », pour dire au lecteur d'ecran ce que le bouton choisit. */
  label: string
}) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const paths = allPaths(locale, pathname)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div
      className="lang"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        className="lang__trigger"
        type="button"
        ref={trigger}
        aria-expanded={open}
        aria-controls="lang-menu"
        aria-label={`${label} : ${LOCALE_NAMES[locale].name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{LOCALE_NAMES[locale].short}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      <ul className="lang__menu" id="lang-menu" hidden={!open}>
        {LOCALES.map((to) => (
          <li key={to}>
            <Link
              className="lang__item"
              href={paths[to]}
              hrefLang={to}
              lang={to}
              // la langue courante reste dans la liste, marquee : sans elle on
              // ne sait pas laquelle est active une fois le menu ouvert
              aria-current={to === locale ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="lang__code" aria-hidden="true">
                {LOCALE_NAMES[to].short}
              </span>
              {LOCALE_NAMES[to].name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
