import { keystoneContext } from 'keystone/context'
import { getSessionContext } from 'keystone/context'

import { createYoga } from 'graphql-yoga'
import { createFetch } from '@whatwg-node/fetch'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'lib/auth'

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
export const GET = auth(function GET(req) {
  if (!req.auth?.allowAdminUI)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const ctx = { waitUntil: () => new Promise(() => {}) }
  return handleRequest(req, ctx)
}) as (req: NextRequest) => Promise<NextResponse>

export const POST = auth(function POST(req) {
  if (!req.auth?.allowAdminUI)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const ctx = { waitUntil: () => new Promise(() => {}) }
  return handleRequest(req, ctx)
}) as (req: NextRequest) => Promise<NextResponse>

export const OPTIONS = auth(function OPTIONS(req) {
  if (!req.auth?.allowAdminUI)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const ctx = { waitUntil: () => new Promise(() => {}) }
  return handleRequest(req, ctx)
}) as (req: NextRequest) => Promise<NextResponse>
