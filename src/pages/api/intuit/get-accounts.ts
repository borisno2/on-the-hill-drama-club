import { getSessionContext } from 'keystone/context'
import { getQBO } from 'lib/intuit'
import { getAccounts } from 'lib/intuit/accounts'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const context = await getSessionContext({ req, res })

  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return res.status(403).send('Not authorized')
  } else {
    const qbo = await getQBO({ context })
    if (!qbo) {
      return res.status(403).send('Not authorized')
    }
    try {
      const accounts = await getAccounts(qbo)
      return res.status(200).send(accounts)
    } catch (e) {
      console.error(e)
      return res.status(500).send(e)
    }
  }
}
