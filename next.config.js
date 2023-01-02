// you don't need this if you're building something outside of the Keystone repo
const withPreconstruct = require('@preconstruct/next')
const KEYSTONE_URL = process.env.KEYSTONE_URL || 'http://localhost:4000'
const Path = require('path')
const { withTsGql } = require('@ts-gql/next')

/** @type {import('next').NextConfig} */
module.exports = withTsGql(
  withPreconstruct({
    webpack(config) {
      config.externals = [...config.externals, '.prisma/client']
      return config
    },
    experimental: {
      scrollRestoration: true,
      appDir: true,
      serverComponentsExternalPackages: ['graphql'],
    },
    images: {
      dangerouslyAllowSVG: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/*',
        },
        {
          protocol: 'https',
          hostname: 'tailwindui.com',
          pathname: '/img/**/*',
        },
      ],
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
)
