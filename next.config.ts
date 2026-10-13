import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fully static site: every page is pre-rendered at build time into ./out
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
