/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.imgur.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    appDir: true,
  },
  ...(process.env.NODE_ENV === 'development' && {
    images: {
      unoptimized: true
    }
  })
}

module.exports = nextConfig