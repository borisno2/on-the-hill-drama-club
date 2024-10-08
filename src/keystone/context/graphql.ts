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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TVariables extends Record<string, any>,
>(args: GraphQLExecutionArguments<TData, TVariables>): Promise<TData> {
  const context = await getServerActionContext()
  const result = await context.graphql.run(args)
  return JSON.parse(JSON.stringify(result))
}
