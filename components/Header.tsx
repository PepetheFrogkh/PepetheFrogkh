'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { dict } from '@/content'
import { other, path, type Locale } from '@/lib/i18n'
import { translatePath } from '@/lib/routes'
import { resolve } from '@/lib/links'
import { track } from '@/lib/analytics'

/**
 * L'en-tete, fixe.
 *
 * Fond creme au repos, blanc legerement transparent et floute au defilement.
 * Le selecteur FR / EN est toujours visible et garde le visiteur sur la meme
 * page. Sur mobile, le menu s'ouvre en plein ecran.
 */
export default function Header({ locale }: { locale: Locale }) {
  const t = dict(locale)
  const pathname = usePathname() ?? path(locale, 'home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const switcher = (
    <div className="lang">
      <span aria-current={locale === 'fr'} {...(locale === 'fr' ? {} : { hidden: true })}>
        FR
      </span>
      {locale === 'fr' ? null : <span aria-current={true}>EN</span>}
      <Link href={translatePath(locale, pathname)} hrefLang={other(locale)} lang={other(locale)}>
        {other(locale).toUpperCase()}
      </Link>
    </div>
  )

  return (
    <>
      <header className="header" data-scrolled={scrolled}>
        <div className="container header__inner">
          <Link className="header__logo" href={path(locale, 'home')}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <circle cx="9" cy="9" r="3" fill="#FF6B00" />
              <ellipse
                cx="9"
                cy="9"
                rx="8"
                ry="3.2"
                className="icon"
                stroke="#C2410C"
                transform="rotate(-18 9 9)"
              />
            </svg>
            Kuiper Studio
          </Link>

          <nav className="header__nav" aria-label={t.meta.siteName}>
            {t.nav.items.map((item) => {
              const href = resolve(locale, item.href)
              return href ? (
                <Link key={item.label} href={href}>
                  {item.label}
                </Link>
              ) : null
            })}
          </nav>

          <div className="header__right">
            {switcher}
            <Link
              className="btn btn--primary btn--small header__cta"
              href={path(locale, 'diagnostic')}
              onClick={() => track('diagnostic_click')}
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
            {t.nav.items.map((item) => {
              const href = resolve(locale, item.href)
              return href ? (
                <Link key={item.label} href={href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ) : null
            })}
            <Link
              className="btn btn--primary drawer__cta"
              href={path(locale, 'diagnostic')}
              onClick={() => {
                setOpen(false)
                track('diagnostic_click')
              }}
            >
              {t.nav.cta}
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  )
}
