import { Context } from '.keystone/types'
import { TokenSet, TokenSetParameters, XeroClient } from 'xero-node'

function getCallbackURL() {
  if (process.env.VERCEL_ENV === 'production') {
    return [`https://www.emilycalder.com.au/api/xero/callback`]
  } else if (
    process.env.VERCEL_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview'
  ) {
    return [`https://emily-calder.vercel.app/api/xero/callback`]
  } else {
    return ['http://localhost:3000/api/xero/callback']
  }
}

const clientKey = process.env.XERO_CLIENT_ID
const clientSecret = process.env.XERO_CLIENT_SECRET

export async function getXeroClient({
  context,
  state,
}: {
  context: Context
  state?: string
}) {
  if (!clientKey || !clientSecret) {
    throw new Error('Missing Xero client key or secret')
  }
  const xeroClient = new XeroClient({
    clientId: clientKey,
    clientSecret: clientSecret,
    state,
    redirectUris: getCallbackURL(),
  })

  const settings = await context.sudo().db.XeroSettings.findOne({})

  if (
    settings &&
    settings.tokenSet &&
    typeof settings.tokenSet !== 'number' &&
    typeof settings.tokenSet !== 'boolean'
  ) {
    const tokenSet = new TokenSet(
      typeof settings.tokenSet === 'string'
        ? JSON.parse(settings.tokenSet)
        : (settings.tokenSet as TokenSetParameters),
    )
    xeroClient.setTokenSet(settings)

    if (tokenSet.expired()) {
      const newTokenSet = await xeroClient.refreshToken()
      context.sudo().db.XeroSettings.updateOne({
        data: { tokenSet: JSON.stringify(newTokenSet) },
      })
    }
  }
  return { xeroClient, xeroTenantId: settings?.tenantId }
}
