import { getServerActionContext } from 'keystone/context/nextAuthFix'
import { getXeroClient } from 'lib/xero'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Parse the redirect URL for authCode and exchange them for tokens
  const parseRedirect = request.url
  if (!parseRedirect) {
    return NextResponse.json({ error: 'Invalid redirect' }, { status: 403 })
  }
  const context = await getServerActionContext()
  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  } else {
    try {
      const stateCookie = cookies().get('emaily_calder_xero_csrf_state')
      if (!stateCookie) {
        return NextResponse.json({ error: 'Invalid state' }, { status: 403 })
      }
      const state = stateCookie.value

      const { xeroClient } = await getXeroClient({ context, state })
      const tokenSet = await xeroClient.apiCallback(parseRedirect)
      await xeroClient.updateTenants()
      const activeTenantId = xeroClient.tenants[0].tenantId
      console.log('activeTenantId', activeTenantId)
      const currentSetting = await context.sudo().db.XeroSettings.findOne({})
      const data = {
        tokenSet: JSON.stringify(tokenSet),
        tenantId: activeTenantId,
      }
      if (currentSetting) {
        await context.sudo().db.XeroSettings.updateOne({
          data,
        })
      } else {
        await context.sudo().db.XeroSettings.createOne({
          data,
        })
      }
    } catch (e) {
      console.error('Error in Xero Callback:' + JSON.stringify(e))
    }
    const url = new URL('/admin', request.nextUrl.origin)
    return NextResponse.redirect(url)
  }
}
