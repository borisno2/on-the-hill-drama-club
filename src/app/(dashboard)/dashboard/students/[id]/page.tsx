import DashboardLayout from "../../../DashboardLayout"
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { getSessionContext } from "app/KeystoneContext";
import StudentForm, { Student } from "components/StudentForm"

import { redirect } from 'next/navigation';
import { isCuid } from "lib/isCuid";
export default async function Students({ params }: { params: { id?: string } }) {
    if (!params.id || !isCuid(params.id)) {
        redirect('/dashboard/students')
    }
    const context = await getSessionContext();
    const student = await context.query.Student.findOne({ where: { id: params.id }, query: 'name id' }) as Student;
    if (!student) {
        redirect('/dashboard/students')
    }

    return (
        <DashboardLayout PageName="Profile">
            <div className="py-4">
                <StudentForm student={student} />
            </div>


        </DashboardLayout>
    )
}
