import type { Metadata } from 'next'
import { Fraunces, Nunito, Nunito_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { dict } from '@/content'
import { LOCALES, SITE_URL, isLocale, path, type Locale } from '@/lib/i18n'
import { alternates } from '@/lib/routes'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import '../globals.css'

/**
 * Le gabarit du site, dans une langue.
 *
 * Les polices sont servies depuis le site : `next/font` les telecharge a la
 * construction et les sert depuis notre domaine, comme le demande le cahier.
 */

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
})

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = dict(lang)

  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: alternates(path(lang, 'home')),
    openGraph: {
      siteName: t.meta.siteName,
      title: t.meta.home.title,
      description: t.meta.home.description,
      locale: lang === 'fr' ? 'fr_FR' : 'en_GB',
      type: 'website',
      url: SITE_URL + path(lang, 'home'),
    },
    robots: { index: true, follow: true },
  }
}

/** Organization et LocalBusiness, comme demande, avec Phnom Penh. */
function structuredData(locale: Locale) {
  const t = dict(locale)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: t.meta.siteName,
        url: SITE_URL,
        email: 'arnaud@kuiperstudio.com',
        founder: [{ '@type': 'Person', name: 'Arnaud' }, { '@type': 'Person', name: 'Louis' }],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Phnom Penh',
          addressCountry: 'KH',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: t.meta.siteName,
        url: SITE_URL,
        email: 'arnaud@kuiperstudio.com',
        description: t.meta.home.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Phnom Penh',
          addressCountry: 'KH',
        },
        areaServed: 'Cambodia',
        priceRange: 'From 499 EUR',
      },
    ],
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = dict(lang)

  return (
    <html
      lang={lang}
      className={`${fraunces.variable} ${nunitoSans.variable} ${nunito.variable}`}
    >
      <body>
        <a className="skip" href="#contenu">
          {t.nav.skip}
        </a>
        <Header locale={lang} />
        <main id="contenu">{children}</main>
        <Footer locale={lang} />
        <CookieBanner locale={lang} />
        <script
          type="application/ld+json"
          // les donnees structurees du cahier : Organization et LocalBusiness
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang)) }}
        />
      </body>
    </html>
  )
}
