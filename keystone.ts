import dotenv from 'dotenv-flow'

import { config } from '@keystone-6/core'

import { lists } from './src/keystone/schema'

dotenv.config()

export default config({
  db: {
    provider: 'postgresql',
    url:
      process.env.DATABASE_URL!,
    prismaPreviewFeatures: ['driverAdapters'],
  },
  ui: {
    isAccessAllowed: ({ session }) => session.allowAdminUI,
    basePath: '/admin',
  },
  lists,
})
