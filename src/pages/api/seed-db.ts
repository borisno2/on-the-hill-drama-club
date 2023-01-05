import { seedDatabase } from 'lib/seed'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // check that the request contains a valid secret key that matched the one in the .env file
  if (
    process.env.SEED_SECRET_KEY &&
    req.body.secretKey !== process.env.SEED_SECRET_KEY
  ) {
    return res.status(403).send('Invalid secret key')
  } else {
    // if the secret key is valid, then we can proceed to seed the database
    // ...
    const seed = await seedDatabase()
    return res
      .status(200)
      .send(`Database seeded successfully with ${seed} records`)
  }
}
