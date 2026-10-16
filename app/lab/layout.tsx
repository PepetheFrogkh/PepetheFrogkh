import type { Metadata, Viewport } from 'next'
import { Fraunces, Nunito, Nunito_Sans } from 'next/font/google'
import '../globals.css'
import CurrencyScript from '@/components/CurrencyScript'

/**
 * Le gabarit du laboratoire.
 *
 * Les routes /lab servent a construire et a valider une piece seule, avant de
 * l'integrer au site. Elles ne sont pas indexees et ne passent pas par le
 * middleware de langue.
 */

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
  variable: '--font-fraunces',
})

const nunitoSans = Nunito_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-nunito-sans' })
const nunito = Nunito({ subsets: ['latin'], display: 'swap', variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Laboratoire · Kuiper Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFF8F3',
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${nunitoSans.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <head>
        <CurrencyScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
