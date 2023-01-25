import { getSessionContext } from 'keystone/context'
import { getQBClient } from 'lib/intuit'
import { NextApiRequest, NextApiResponse } from 'next'
import OAuthClient from 'intuit-oauth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const context = await getSessionContext({ req, res })
  const qbo = await getQBClient({ context })

  return res.redirect(
    qbo.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
      state: 'testState',
    })
  )
}
