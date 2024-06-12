import dotenv from 'dotenv'

import { config } from '@keystone-6/core'

import { lists } from './src/keystone/schema'

dotenv.config()

export default config({
  db: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL!,
    extendPrismaSchema: (schema) => {
      return schema.replace(
        /(generator [^}]+)}/g,
        ['$1', 'previewFeatures = ["driverAdapters"]\n', '}'].join(''),
      )
    },
  },
  ui: {
    isAccessAllowed: ({ session }) => session.allowAdminUI,
    basePath: '/admin',
  },
  lists,
})
