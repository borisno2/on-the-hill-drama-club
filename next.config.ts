import type { NextConfig } from 'next'

const KEYSTONE_URL = process.env.KEYSTONE_URL || 'http://localhost:4000'

const nextConfig: NextConfig = {
  serverExternalPackages: ['graphql', 'ws'],
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/enrol',
        destination: '/auth/register',
        permanent: true,
      },
      {
        source: '/enroll',
        destination: '/auth/register',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [],
      fallback: [
        {
          source: '/admin',
          destination: `${KEYSTONE_URL}/admin`,
        },
        {
          source: '/admin/:admin*',
          destination: `${KEYSTONE_URL}/admin/:admin*`,
        },
      ],
      afterFiles: [],
    }
  },
}

export default nextConfig
