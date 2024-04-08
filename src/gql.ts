import { initGraphQLTada } from 'gql.tada'
import type { introspection } from './graphql-env.js'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: {
    CalendarDay: string
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment } from 'gql.tada'
