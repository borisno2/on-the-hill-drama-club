import { getServerActionContext } from 'keystone/context/nextAuthFix'
import { getXeroClient } from 'lib/xero'
import Tokens from 'csrf'
import { NextRequest, NextResponse } from 'next/server'
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
    const { xeroClient } = await getXeroClient({
      context,
      state: generateAntiForgery(),
    })
    const consentUrl = await xeroClient.buildConsentUrl()

    return redirect(consentUrl)
  }
}
