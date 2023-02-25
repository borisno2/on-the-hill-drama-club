import DashboardLayout from "../DashboardLayout"
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Account - Student Portal'),
}


export default function Notifications() {

    return (
        <DashboardLayout PageName="Account"><div className="py-4">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
                <h1 className="text-2xl font-bold">Coming Soon</h1>
            </div>

        </div>
        </DashboardLayout>
    )
}
