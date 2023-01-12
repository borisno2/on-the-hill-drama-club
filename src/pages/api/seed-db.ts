import { isCuid } from 'cuid'
import { getSessionContext } from 'keystone/context'
import { seedDatabase } from 'lib/seed'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // check that the request contains a valid secret key that matched the one in the .env file
  if (
    !process.env.SEED_SECRET_KEY ||
    req.body.secretKey !== process.env.SEED_SECRET_KEY
  ) {
    return res.status(403).send('Invalid secret key')
  } else {
    // if the secret key is valid, then we can proceed to seed the database
    const madeAdmin = { userId: '', success: false }
    if (
      process.env.MAKE_ADMIN_ADDRESS &&
      isCuid(process.env.MAKE_ADMIN_ADDRESS)
    ) {
      const context = await getSessionContext({ req, res })
      const adminCount = await context.sudo().query.User.count({
        where: { role: { equals: 'ADMIN' } },
      })
      if (adminCount === 0) {
        const userId = process.env.MAKE_ADMIN_ADDRESS
        if (context.session && userId === context.session.userId) {
          await context.sudo().query.User.updateOne({
            where: { id: userId },
            data: { role: 'ADMIN' },
          })
          console.log(`Made ${userId} an admin`)
          madeAdmin.userId = userId
          madeAdmin.success = true
        }
      }
    }
    const seed = await seedDatabase()
    return res.status(200).send({ seed, madeAdmin })
  }
}
