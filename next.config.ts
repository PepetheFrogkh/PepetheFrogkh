import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three ships untranspiled ESM examples; keep them in the Next compile graph.
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['@react-three/drei'],
  },
}

export default nextConfig
