import { getServerActionContext } from 'keystone/context/nextAuthFix'
import { getQBClient } from 'lib/intuit'
import { redirect } from 'next/navigation'
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
    const oauthClient = await getQBClient({ context })

    // Exchange the auth code retrieved from the **req.url** on the redirectUri
    oauthClient
      .createToken(parseRedirect)
      .then(function (authResponse) {
        // Store the token in the database
        const settings = context
          .sudo()
          .db.QuickBooksSettings.findOne({})
          .then((settings) => {
            const data = {
              accessToken: authResponse.getJson().access_token,
              refreshToken: authResponse.getJson().refresh_token,
              realmId: searchParams.get('realmId') as string,
            }
            if (settings) {
              context.sudo().db.QuickBooksSettings.updateOne({
                data,
              })
            } else {
              context.sudo().db.QuickBooksSettings.createOne({
                data,
              })
            }
          })
      })
      .catch(function (e) {
        console.error('The error message is :' + e.originalMessage)
        console.error(e.intuit_tid)
      })
    redirect('/api/intuit/get-accounts')
  }
}
