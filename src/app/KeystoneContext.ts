import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { keystoneContext } from 'keystone/context'

export async function getSessionContext() {
  const session = await unstable_getServerSession(authOptions)
  const context = keystoneContext.withSession(session)
  return context
}
