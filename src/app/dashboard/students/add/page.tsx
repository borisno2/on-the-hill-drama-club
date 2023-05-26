import { getSessionContext } from 'keystone/context'
import StudentForm from '../StudentForm'
import DashboardLayout from '../../DashboardLayout'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  ...getMetadata('Add Student - Student Portal'),
}

export default async function NewStudent() {
  const context = await getSessionContext()
  const { session } = context
  if (!session) {
    redirect('/auth/signin')
  }
  const { accountId } = session.data
  if (!accountId) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout PageName="Students">
      <div className="py-4">
        <StudentForm accountId={accountId} />
      </div>
    </DashboardLayout>
  )
}
