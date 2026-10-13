import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // le cahier impose WebP ou AVIF, charges a la demande
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
