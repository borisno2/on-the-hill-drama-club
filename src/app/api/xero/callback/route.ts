import { getServerActionContext } from 'keystone/context/nextAuthFix'
import { getXeroClient } from 'lib/xero'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Parse the redirect URL for authCode and exchange them for tokens
  const { searchParams } = new URL(request.url)
  const parseRedirect = request.url
  if (!parseRedirect) {
    return NextResponse.json({ error: 'Invalid redirect' }, { status: 403 })
  }
  const context = await getServerActionContext()
  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  } else {
    try {
      const { xeroClient } = await getXeroClient({ context })
      const tokenSet = await xeroClient.apiCallback(parseRedirect)
      await context
        .sudo()
        .db.XeroSettings.findOne({})
        .then((settings) => {
          const data = { tokenSet: JSON.stringify(tokenSet) }
          if (settings) {
            context.sudo().db.XeroSettings.updateOne({
              data,
            })
          } else {
            context.sudo().db.XeroSettings.createOne({
              data,
            })
          }
        })
    } catch (e) {
      console.error('Error in Xero Callback:' + e)
    }
    return NextResponse.redirect('/api/xero/get-accounts')
  }
}
