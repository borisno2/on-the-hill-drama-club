const KEYSTONE_URL = process.env.KEYSTONE_URL || 'http://localhost:4000'

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    scrollRestoration: true,
    serverComponentsExternalPackages: ['graphql', 'ws'],
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
      afterFiles: [
        {
          source: '/admin',
          destination: `${KEYSTONE_URL}/admin`,
        },
        {
          source: '/admin/:admin*',
          destination: `${KEYSTONE_URL}/admin/:admin*`,
        },
      ],
    }
  },
}
