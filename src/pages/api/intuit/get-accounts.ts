import { getSessionContext } from 'keystone/context'
import { getQBO } from 'lib/intuit'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const context = await getSessionContext({ req, res })
  const qbo = await getQBO({ context })
  if (!qbo) {
    return res.status(403).send('Not authorized')
  }
  qbo.findAccounts(function (_, accounts) {
    accounts.QueryResponse.Account.forEach(function (account) {
      console.log(account.Name)
    })
  })
  //const settings = await context.sudo().db.QuickBooksSettings.findOne({})
  //const url =
  //  qbo.environment == 'sandbox'
  //    ? OAuthClient.environment.sandbox
  //    : OAuthClient.environment.production
  //qbo
  //  .makeApiCall({
  //    url: `${url}v3/company/${settings?.realmId}/query?query=select%20%2A%20from%20Account`,
  //    method: 'GET',
  //  })
  //  .then(function (response) {
  //    console.log('The response is  ' + JSON.stringify(response))
  //  })
  //  .catch(function (e) {
  //    console.error('The error message is :' + e.originalMessage)
  //    console.error(e.intuit_tid)
  //  })
  return res.status(200).send('ok')
}
