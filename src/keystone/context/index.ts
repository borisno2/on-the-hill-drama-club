import { getContext } from '@keystone-6/core/context'
import config from '../../../keystone'
import * as PrismaModule from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'
import { auth } from 'lib/auth'

import type { Session } from 'next-auth'
import type { Context } from '.keystone/types'

class NeonPrismaClient extends PrismaModule.PrismaClient {
  constructor(ksConfig: PrismaModule.Prisma.PrismaClientOptions) {
    neonConfig.webSocketConstructor = ws
    const connectionString = `${process.env.DATABASE_URL}`

    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool)

    super({ ...ksConfig, adapter, datasourceUrl: undefined })
  }
}

// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).keystoneContext ||
  getContext(config, { ...PrismaModule, PrismaClient: NeonPrismaClient })

if (process.env.NODE_ENV !== 'production')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).keystoneContext = keystoneContext

export async function getSessionContext(): Promise<Context<Session>> {
  const session = await auth()
  return keystoneContext.withSession(session)
}
