// you don't need this if you're building something outside of the Keystone repo
const withPreconstruct = require('@preconstruct/next')
const KEYSTONE_URL = process.env.KEYSTONE_URL || 'http://localhost:4000'
const Path = require('path')
const { withTsGql } = require('@ts-gql/next')

/** @type {import('next').NextConfig} */
module.exports = withTsGql(
  withPreconstruct({
    webpack(config) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: Path.dirname(require.resolve('react/package.json')),
        'react-dom': Path.dirname(require.resolve('react-dom/package.json')),
        '@keystone-6/core': Path.dirname(
          require.resolve('@keystone-6/core/package.json')
        ),
      }
      config.externals = [...config.externals, '.prisma/client']
      return config
    },
    experimental: {
      scrollRestoration: true,
    },
    images: {
      dangerouslyAllowSVG: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'tailwindui.com',
          pathname: '/img/**/*',
          port: '',
        },
      ],
    },
    async rewrites() {
      return {
        beforeFiles: [
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
