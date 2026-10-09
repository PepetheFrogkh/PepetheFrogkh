import type { Metadata, Viewport } from 'next'
import { Archivo, Playfair_Display, Noto_Sans_Khmer } from 'next/font/google'
import './globals.css'

const display = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const script = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic', 'normal'],
  variable: '--font-script',
  display: 'swap',
})

const khmer = Noto_Sans_Khmer({
  subsets: ['khmer'],
  weight: ['400', '600'],
  variable: '--font-khmer',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hanuman-webgl.vercel.app'),
  title: 'Hanuman Premium Lager — Greatness in every drop',
  description:
    'Ice cold, golden and crisp. Hanuman Premium Lager is brewed in Phnom Penh to the finest German brewing standards — double gold at Monde Selection 2024.',
  keywords: [
    'Hanuman beer',
    'Hanuman Premium Lager',
    'Hanuman Black',
    'Cambodian beer',
    'Phnom Penh brewery',
  ],
  openGraph: {
    title: 'Hanuman Premium Lager — Greatness in every drop',
    description:
      'Ice cold, golden and crisp. Brewed in Phnom Penh to the finest German brewing standards.',
    type: 'website',
    locale: 'en',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#013e6a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${khmer.variable}`}>
      <body>{children}</body>
    </html>
  )
}
