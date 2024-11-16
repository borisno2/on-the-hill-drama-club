import { getContext } from '@keystone-6/core/context'
import config from '../../../keystone'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'lib/authConfig'
import * as PrismaModule from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

import type { NextApiRequest, NextApiResponse } from 'next/types'
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

export async function getSessionContext(props?: {
  req: NextApiRequest
  res: NextApiResponse
}): Promise<Context<Session>> {
  let session = null
  if (props) {
    const { req, res } = props
    session = await getServerSession(req, res, authOptions)
  }
  // running in the app directory, so we don't need to pass req and res
  else session = await getServerSession(authOptions)
  return keystoneContext.withSession(session)
}
