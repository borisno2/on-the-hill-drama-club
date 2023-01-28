import { Context } from '.keystone/types'
import OAuthClient from 'intuit-oauth'
import QuickBooks from 'node-quickbooks'

export const clientKey = process.env.QUICKBOOKS_CLIENT_ID
export const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET

async function getQBOAccess({ context }: { context: Context }) {
  if (!clientKey || !clientSecret) {
    throw new Error('Missing QuickBooks client key or secret')
  }
  const oauthClient = new OAuthClient({
    clientId: clientKey,
    clientSecret: clientSecret,
    environment: 'sandbox',
    redirectUri: 'http://localhost:3000/api/intuit/callback',
  })
  const settings = await context.sudo().db.QuickBooksSettings.findOne({})
  if (!settings || !settings.accessToken || !settings.refreshToken) {
    return null
  }
  oauthClient.setToken(settings.accessToken, settings.refreshToken)
  if (!oauthClient.isAccessTokenValid()) {
    await oauthClient
      .refreshUsingToken(settings.refreshToken)
      .then(function (authResponse) {
        context.sudo().db.QuickBooksSettings.updateOne({
          data: {
            accessToken: authResponse.getJson().access_token,
            refreshToken: authResponse.getJson().refresh_token,
          },
        })
      })
      .catch(function (e) {
        console.error('The error message is :' + e.originalMessage)
        console.error(e.intuit_tid)
      })
  }
  return {
    accessToken: oauthClient.getToken().access_token,
    refreshToken: oauthClient.getToken().refresh_token,
    realmId: settings.realmId,
  }
}
function getCallbackURL() {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/intuit/callback`
  }
  return 'http://localhost:3000/api/intuit/callback'
}

export async function getQBClient({ context }: { context: Context }) {
  if (!clientKey || !clientSecret) {
    throw new Error('Missing QuickBooks client key or secret')
  }
  const oauthClient = new OAuthClient({
    clientId: clientKey,
    clientSecret: clientSecret,
    environment:
      process.env.VERCEL_ENV === 'production' ? 'production' : 'sandbox',
    redirectUri: getCallbackURL(),
  })

  const qboAuth = await context.sudo().db.QuickBooksSettings.findOne({})
  if (qboAuth && qboAuth.accessToken && qboAuth.refreshToken) {
    oauthClient.setToken(qboAuth.accessToken, qboAuth.refreshToken)

    if (!oauthClient.isAccessTokenValid()) {
      await oauthClient
        .refreshUsingToken(qboAuth.refreshToken)
        .then(function (authResponse) {
          context.sudo().db.QuickBooksSettings.updateOne({
            data: {
              accessToken: authResponse.getJson().access_token,
              refreshToken: authResponse.getJson().refresh_token,
            },
          })
        })
        .catch(function (e) {
          console.error('The error message is :' + e.originalMessage)
          console.error(e.intuit_tid)
        })
    }
  }
  return oauthClient
}

export async function getQBO({ context }: { context: Context }) {
  const qboAuth = await getQBOAccess({ context })
  if (
    !qboAuth ||
    !qboAuth.accessToken ||
    !qboAuth.realmId ||
    !clientKey ||
    !clientSecret
  ) {
    return null
  }

  var qbo = new QuickBooks(
    clientKey,
    clientSecret,
    qboAuth.accessToken /* oAuth access token */,
    false /* no token secret for oAuth 2.0 */,
    qboAuth?.realmId,
    true /* use a sandbox account */,
    false /* turn debugging on */,
    4 /* minor version */,
    '2.0' /* oauth version */,
    qboAuth.refreshToken /* refresh token */
  )
  return qbo
}
