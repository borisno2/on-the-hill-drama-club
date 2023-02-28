import DashboardLayout from "../DashboardLayout"
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Notifications - Student Portal'),
}


export default function Account() {

    return (
        <DashboardLayout PageName="Account"><div className="py-4">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
        </div>
        </DashboardLayout>
    )
}
