import { getSessionContext } from 'keystone/context'
import { getQBClient } from 'lib/intuit'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Parse the redirect URL for authCode and exchange them for tokens
  const parseRedirect = req.url
  const context = await getSessionContext({ req, res })
  const oauthClient = await getQBClient({ context })
  console.log('oauthClient', oauthClient)
  console.log('parseRedirect', parseRedirect)

  // Exchange the auth code retrieved from the **req.url** on the redirectUri
  oauthClient
    .createToken(parseRedirect)
    .then(function (authResponse) {
      console.log('The Token is  ' + JSON.stringify(authResponse.getJson()))
      // Store the token in the database
      const settings = context
        .sudo()
        .db.QuickBooksSettings.findOne({})
        .then((settings) => {
          const data = {
            accessToken: authResponse.getJson().access_token,
            refreshToken: authResponse.getJson().refresh_token,
            realmId: req.query.realmId as string,
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
  res.redirect('/api/intuit/get-accounts')
}
