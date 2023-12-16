import { keystoneContext } from 'keystone/context'
import { getServerActionContext } from 'keystone/context/nextAuthFix'

import { createYoga } from 'graphql-yoga'
import { createFetch } from '@whatwg-node/fetch'

const { handleRequest } = createYoga({
  schema: keystoneContext.graphql.schema,
  context: async () => getServerActionContext(),

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

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
