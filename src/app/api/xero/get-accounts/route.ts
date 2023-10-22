import { getServerActionContext } from 'keystone/context/nextAuthFix'
import { getXeroClient } from 'lib/xero'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const context = await getServerActionContext()

  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  } else {
    const { xeroClient, xeroTenantId } = await getXeroClient({ context })
    if (!xeroClient || !xeroTenantId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    try {
      const accounts = await xeroClient.accountingApi.getAccounts(xeroTenantId)
      return NextResponse.json(accounts)
    } catch (error) {
      console.error(error)
      return NextResponse.json({ error }, { status: 500 })
    }
  }
}
