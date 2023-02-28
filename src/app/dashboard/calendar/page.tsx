import DashboardLayout from "../DashboardLayout"
import CalendarComp from 'components/Calendar'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Calendar - Student Portal'),
}


export default function Calendar() {

    return (
        <DashboardLayout PageName="Calendar">
            <CalendarComp />
        </DashboardLayout>
    )
}
