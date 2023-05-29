import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'
import { cookies, headers } from 'next/headers'
import { keystoneContext } from '.'
import type { Context } from '.keystone/types'

export async function getServerActionContext() {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  }
  const res = { getHeader() {}, setCookie() {}, setHeader() {} }

  // @ts-expect-error - Forcing getServerSession to work with Server Actions
  const session = await getServerSession(req, res, authOptions)

  return keystoneContext.withSession(session) as Context
}
