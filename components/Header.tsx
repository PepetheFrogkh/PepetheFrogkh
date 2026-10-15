'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { dict } from '@/content'
import {
  SERVICES,
  expertisePath,
  path,
  type ExpertiseKey,
  type Locale,
  type ServiceKey,
  servicePath,
} from '@/lib/i18n'
import { visibleExpertises } from '@/lib/flags'
import { resolve } from '@/lib/links'
import { track } from '@/lib/analytics'
import CurrencySwitch from './CurrencySwitch'
import LangSwitch from './LangSwitch'

/**
 * L'en-tete, fixe.
 *
 * Fond creme au repos, blanc legerement transparent et floute au defilement.
 * Les selecteurs de devise et de langue sont toujours visibles et gardent le
 * visiteur sur la meme page.
 *
 * Services et Expertises ouvrent un menu deroulant riche : chaque entree porte
 * son nom et une ligne qui dit ce qu'elle contient. Le menu s'ouvre au survol
 * sur un appareil a souris, et au clic partout, ce qui le rend utilisable au
 * doigt comme au clavier. Echap le ferme et rend le focus au bouton, et il se
 * ferme aussi des que le focus sort du groupe.
 *
 * Sur mobile, le menu s'ouvre en plein ecran, les deux groupes deplies : un
 * menu deroulant dans un menu deroulant ne se manipule pas au pouce.
 */

/** Les deux groupes qui ouvrent un menu, et de quoi construire leurs entrees. */
const GROUPS = ['services', 'expertises'] as const
type Group = (typeof GROUPS)[number]

function entries(locale: Locale, group: Group) {
  const t = dict(locale)
  if (group === 'services') {
    return SERVICES.map((key) => ({
      key,
      href: servicePath(locale, key),
      name: t.map.services.children[key],
      desc: t.menu.services[key],
    }))
  }
  return visibleExpertises(t).map((key) => ({
    key,
    href: expertisePath(locale, key),
    name: t.map.expertises.children[key],
    desc: t.menu.expertises[key],
  }))
}

export default function Header({ locale }: { locale: Locale }) {
  const t = dict(locale)
  const pathname = usePathname() ?? path(locale, 'home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<Group | null>(null)
  const closing = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // le menu plein ecran bloque le defilement derriere lui
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // un changement de page ferme tout
  useEffect(() => {
    setOpen(false)
    setMenu(null)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      setMenu(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /** Le survol ferme avec un peu de retard : sinon le menu fuit le curseur. */
  const hold = useCallback((next: Group | null) => {
    window.clearTimeout(closing.current)
    if (next === null) {
      closing.current = window.setTimeout(() => setMenu(null), 140)
    } else {
      setMenu(next)
    }
  }, [])

  const switcher = <LangSwitch locale={locale} pathname={pathname} label={t.nav.language} />

  /** Les entrees qui ne sont que des liens. */
  const plain = t.nav.items.filter((item) => !GROUPS.includes(item.href as Group))

  return (
    <>
      <header className="header" data-scrolled={scrolled}>
        <div className="container header__inner">
          <Link className="header__logo" href={path(locale, 'home')}>
            {/* Le logo fourni. On passe le fichier en double densite et on
                laisse Next servir la bonne taille ; `priority` parce qu'il est
                dans le premier ecran, sans quoi il arrive apres le texte. */}
            <Image
              src="/logo@2x.png"
              alt=""
              width={35}
              height={28}
              priority
            />
            Kuiper Studio
          </Link>

          <nav className="header__nav" aria-label={t.meta.siteName}>
            {GROUPS.map((group) => (
              <div
                className="menu"
                key={group}
                onMouseEnter={() => hold(group)}
                onMouseLeave={() => hold(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) setMenu(null)
                }}
              >
                <button
                  className="menu__trigger"
                  type="button"
                  aria-expanded={menu === group}
                  aria-controls={`menu-${group}`}
                  onClick={() => setMenu(menu === group ? null : group)}
                >
                  {t.map[group].title}
                  <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>

                <div
                  className={`menu__panel${group === 'expertises' ? ' menu__panel--two' : ''}`}
                  id={`menu-${group}`}
                  hidden={menu !== group}
                >
                  <ul className="menu__list">
                    {entries(locale, group).map((item) => (
                      <li key={item.key}>
                        <Link className="menu__item" href={item.href}>
                          <span className="menu__name">{item.name}</span>
                          <span className="menu__desc">{item.desc}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link className="menu__all link-more" href={path(locale, group)}>
                    {t.nav.seeAll}
                  </Link>
                </div>
              </div>
            ))}

            {plain.map((item) => {
              const href = resolve(locale, item.href)
              return href ? (
                <Link key={item.label} href={href}>
                  {item.label}
                </Link>
              ) : null
            })}
          </nav>

          <div className="header__right">
            <CurrencySwitch label={t.nav.currency} />
            {switcher}
            <Link
              className="btn btn--primary btn--small header__cta"
              href={path(locale, 'pricing')}
              onClick={() => track('estimate_click')}
            >
              <span className="header__cta-long">{t.nav.cta}</span>
              <span className="header__cta-short">{t.nav.ctaShort}</span>
            </Link>
            <button
              className="header__burger"
              type="button"
              aria-expanded={open}
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="drawer">
          <div className="container header__inner">
            <span className="header__logo">Kuiper Studio</span>
            <div className="header__right">
              <CurrencySwitch label={t.nav.currency} />
              {switcher}
              <button
                className="header__burger"
                type="button"
                aria-label={t.nav.close}
                onClick={() => setOpen(false)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>

          <nav className="container drawer__links" aria-label={t.meta.siteName}>
            {GROUPS.map((group) => (
              <div className="drawer__group" key={group}>
                <Link className="drawer__head" href={path(locale, group)}>
                  {t.map[group].title}
                </Link>
                <ul>
                  {entries(locale, group).map((item) => (
                    <li key={item.key}>
                      <Link href={item.href}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="drawer__group drawer__group--plain">
              <ul>
                {plain.map((item) => {
                  const href = resolve(locale, item.href)
                  return href ? (
                    <li key={item.label}>
                      <Link href={href}>{item.label}</Link>
                    </li>
                  ) : null
                })}
              </ul>
            </div>

            <Link
              className="btn btn--primary drawer__cta"
              href={path(locale, 'pricing')}
              onClick={() => track('estimate_click')}
            >
              {t.nav.cta}
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  )
}
