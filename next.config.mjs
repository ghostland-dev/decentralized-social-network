/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enforce lint errors during builds in CI
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail the build on TS errors in CI
    ignoreBuildErrors: false,
  },
  images: {
    // Enable optimized images in production (disable unoptimized)
    unoptimized: false,
    remotePatterns: [
      // Allow common avatar/CDN hosts if needed; tighten as required
      { protocol: 'https', hostname: '**' },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Keep as-needed, Next.js 15 features are on by default
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
