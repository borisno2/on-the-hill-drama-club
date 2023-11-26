import { getContext } from '@keystone-6/core/context'
import config from '../../../keystone'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import * as PrismaModule from '@prisma/client'
import { Client } from '@planetscale/database'
import { PrismaPlanetScale } from '@prisma/adapter-planetscale'

import type { NextApiRequest, NextApiResponse } from 'next/types'
import type { Session } from 'next-auth'
import type { Context } from '.keystone/types'

class PlanetScalePrismaClient extends PrismaModule.PrismaClient {
  constructor(ksConfig: any) {
    const config = {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    }

    // Initialize Prisma Client with the PlanetScale serverless database driver
    const client = new Client(config)
    const adapter = new PrismaPlanetScale(client)

    super({ ...ksConfig, adapter })
  }
}

// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context =
  (globalThis as any).keystoneContext ||
  getContext(config, { ...PrismaModule, PrismaClient: PlanetScalePrismaClient })

if (process.env.NODE_ENV !== 'production')
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
