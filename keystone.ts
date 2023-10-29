import dotenv from 'dotenv-flow'

import { config } from '@keystone-6/core'

import { lists } from './src/keystone/schema'

dotenv.config()

export default config({
  db: {
    provider: 'mysql',
    url:
      process.env.DATABASE_URL ||
      'mysql://root:my-secret-pw@localhost:49949/onthehilldrama',
    additionalPrismaDatasourceProperties: {
      relationMode: 'prisma',
    },
    prismaPreviewFeatures: ['driverAdapters'],
  },
  ui: {
    isAccessAllowed: ({ session }) => session.allowAdminUI,
    basePath: '/admin',
  },
  lists,
})
