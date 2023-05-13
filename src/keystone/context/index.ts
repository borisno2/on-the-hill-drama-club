'use server'
import { getContext } from '@keystone-6/core/context'
import config from '../../../keystone'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import * as PrismaModule from '@prisma/client'
import { Context } from '.keystone/types'
import { NextApiRequest, NextApiResponse } from 'next/types'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql'

// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context =
  (globalThis as any).keystoneContext || getContext(config, PrismaModule)

if (process.env.NODE_ENV !== 'production')
  (globalThis as any).keystoneContext = keystoneContext

export async function getSessionContext(props?: {
  req: NextApiRequest
  res: NextApiResponse
}): Promise<Context> {
  let session = null
  if (props) {
    const { req, res } = props
    session = await getServerSession(req, res, authOptions)
  }
  // running in the app directory, so we don't need to pass req and res
  else session = await getServerSession(authOptions)
  return keystoneContext.withSession(session)
}
type GraphQLExecutionArguments<TData, TVariables> = {
  query: string | DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
};

export async function runKeystoneGraphQL<TData, TVariables extends Record<string, any>>(
  args: GraphQLExecutionArguments<TData, TVariables>
): Promise<TData> {
  const context = await getSessionContext()
  return await context.graphql.run(args)
}