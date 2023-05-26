import { keystoneContext, getSessionContext } from 'keystone/context'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { getServerActionContext } from 'keystone/context/nextAuthFix'

const apolloServer = new ApolloServer({
  schema: keystoneContext.graphql.schema,
})

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
  context: async () => getServerActionContext(),
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}
