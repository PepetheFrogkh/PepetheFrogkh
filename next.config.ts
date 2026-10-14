import type { NextConfig } from 'next'

/**
 * Les anciennes adresses.
 *
 * Le plan du site a change : les situations deviennent les expertises, la
 * methode passe dans l'accueil, le diagnostic devient le contact. Les
 * anciennes adresses ont pu etre partagees, indexees, mises en favori : elles
 * repondent donc en 301 vers la page qui les remplace plutot qu'en 404.
 *
 * Les pages situation ne sont pas redirigees une par une vers une expertise :
 * la correspondance serait devinee. Elles renvoient toutes vers la liste des
 * expertises, ou le visiteur choisit lui-meme.
 */
const redirects = [
  { from: '/fr/situations', to: '/fr/expertises' },
  { from: '/fr/situations/:slug', to: '/fr/expertises' },
  { from: '/en/situations', to: '/en/expertise' },
  { from: '/en/situations/:slug', to: '/en/expertise' },
  { from: '/fr/methode', to: '/fr' },
  { from: '/en/method', to: '/en' },
  { from: '/fr/diagnostic', to: '/fr/contact' },
  { from: '/en/diagnostic', to: '/en/contact' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // le cahier impose WebP ou AVIF, charges a la demande
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return redirects.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    }))
  },
}

export default nextConfig
