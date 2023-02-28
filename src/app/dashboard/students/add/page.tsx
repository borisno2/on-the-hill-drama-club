import { getSessionContext } from "keystone/context";
import StudentForm from "../StudentForm"
import DashboardLayout from "../../DashboardLayout"
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Add Student - Student Portal'),
}


export default async function NewStudent() {
    const context = await getSessionContext();
    const { accountId } = context.session.data

    return (
        <DashboardLayout PageName="Students">
            <div className="py-4">
                <StudentForm accountId={accountId} />
            </div>
        </DashboardLayout>
    )
}
