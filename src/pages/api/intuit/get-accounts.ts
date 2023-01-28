import { getSessionContext } from 'keystone/context'
import { getQBO } from 'lib/intuit'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const context = await getSessionContext({ req, res })
  console.log('session', context.session)

  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return res.status(403).send('Not authorized')
  } else {
    const qbo = await getQBO({ context })
    if (!qbo) {
      return res.status(403).send('Not authorized')
    }
    qbo.findAccounts({}, function (_, accounts) {
      return res.status(200).send(accounts.QueryResponse)
    })
  }
}
