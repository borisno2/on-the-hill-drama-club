import { getServerActionContext } from 'keystone/context/nextAuthFix'
import { getQBClient } from 'lib/intuit'
import OAuthClient from 'intuit-oauth'
import Tokens from 'csrf'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

const csrf = new Tokens()
function generateAntiForgery() {
  const secret = process.env.NEXTAUTH_SECRET!
  return csrf.create(secret)
}

export async function GET() {
  const context = await getServerActionContext()
  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  } else {
    const qbo = await getQBClient({ context })

    return redirect(
      qbo.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
        state: generateAntiForgery(),
      })
    )
  }
}
