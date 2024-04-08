import { initGraphQLTada } from 'gql.tada'
import type { introspection } from './graphql-env.js'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: {
    CalendarDay: string
    ID: string
    Int: number
    JSON: import('@keystone-6/core/types').JSONValue
    Decimal: import('@keystone-6/core/types').Decimal
    DateTime: any
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'
