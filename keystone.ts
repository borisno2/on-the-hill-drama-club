import dotenv from 'dotenv-flow'
import * as Path from 'path'

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
      referentialIntegrity: 'prisma',
    },
    useMigrations: true,
    prismaPreviewFeatures: ['referentialIntegrity'],
  },
  ui: {
    isAccessAllowed: ({ session }) => session.allowAdminUI,
    getAdditionalFiles: [
      async () => [
        {
          mode: 'copy',
          inputPath: Path.resolve('./next-config.js'),
          outputPath: 'next.config.js',
        },
      ],
    ],
  },
  lists,
})
