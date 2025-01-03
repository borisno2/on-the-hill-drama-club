import { getSessionContext, keystoneContext } from 'keystone/context'

import { createYoga } from 'graphql-yoga'
import { createFetch } from '@whatwg-node/fetch'

const { handleRequest } = createYoga({
  schema: keystoneContext.graphql.schema,
  context: async () => getSessionContext(),

  graphqlEndpoint: '/api/graphql',

  fetchAPI: {
    ...createFetch({
      formDataLimits: {
        // Maximum allowed file size (in bytes)
        fileSize: 4500,
        // Maximum allowed number of files
        files: 10,
        // Maximum allowed size of content (operations, variables etc...)
        fieldSize: 1000000,
        // Maximum allowed header size for form data
        headerSize: 1000000,
      },
    }),
    Response,
  },
})
export async function GET(request: Request) {
  const ctx = { waitUntil: () => new Promise(() => {}) }
  return handleRequest(request, ctx)
}
export async function POST(request: Request) {
  const ctx = { waitUntil: () => new Promise(() => {}) }
  return handleRequest(request, ctx)
}
export async function OPTIONS(request: Request) {
  const ctx = { waitUntil: () => new Promise(() => {}) }
  return handleRequest(request, ctx)
}
