import { isCuid } from 'cuid'
import { keystoneContext } from 'keystone/context'
import { seedDatabase } from 'lib/seed'

async function main() {
  const context = keystoneContext

  console.log(`🌱 Inserting seed data`)
  if (
    process.env.MAKE_ADMIN_ADDRESS &&
    isCuid(process.env.MAKE_ADMIN_ADDRESS)
  ) {
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
      }
    }
  }

  await seedDatabase()

  console.log(`✅ Seed data inserted`)
  console.log(
    `👋 Please start the process with \`yarn dev\` or \`npm run dev\``,
  )
}

main()
