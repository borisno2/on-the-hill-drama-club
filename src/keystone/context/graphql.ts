'use server'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { DocumentNode } from 'graphql'
import { getServerActionContext } from './nextAuthFix'
type GraphQLExecutionArguments<TData, TVariables> = {
  query: string | DocumentNode | TypedDocumentNode<TData, TVariables>
  variables?: TVariables
}

export async function runKeystoneGraphQL<
  TData,
  TVariables extends Record<string, any>,
>(args: GraphQLExecutionArguments<TData, TVariables>): Promise<TData> {
  const context = await getServerActionContext()
  return await context.graphql.run(args)
}
