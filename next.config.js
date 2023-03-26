const KEYSTONE_URL = process.env.KEYSTONE_URL || 'http://localhost:4000'
const { withTsGql } = require('@ts-gql/next')

/** @type {import('next').NextConfig} */
module.exports = withTsGql({
  experimental: {
    scrollRestoration: true,
    appDir: true,
    serverComponentsExternalPackages: ['graphql'],
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
})
