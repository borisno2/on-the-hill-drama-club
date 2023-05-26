import { getServerActionContext } from 'keystone/context/nextAuthFix'
import { getQBO } from 'lib/intuit'
import { getAccounts } from 'lib/intuit/accounts'
import { NextResponse } from 'next/server'

export async function GET() {
  const context = await getServerActionContext()

  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  } else {
    const qbo = await getQBO({ context })
    if (!qbo) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    try {
      const accounts = await getAccounts(qbo)
      return NextResponse.json(accounts)
    } catch (error) {
      console.error(error)
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
