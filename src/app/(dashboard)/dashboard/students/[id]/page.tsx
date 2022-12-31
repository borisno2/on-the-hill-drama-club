import DashboardLayout from '../../../DashboardLayout'
import { getSessionContext } from 'app/KeystoneContext'
import StudentForm from 'components/StudentForm'

import { redirect } from 'next/navigation'
import { isCuid } from 'cuid'

import LessonList from '../../lessons/LessonList'
import { GET_STUDENT_BY_ID } from '../queries'


export default async function Students({
    params,
}: {
    params: { id?: string }
}) {
    if (!params.id || !isCuid(params.id)) {
        redirect('/dashboard/students')
    }
    const context = await getSessionContext()
    const { student } = await context.graphql.run({
        query: GET_STUDENT_BY_ID,
        variables: { id: params.id },
    })
    if (!student) {
        redirect('/dashboard/students')
    }
    const availableWhere = {
        AND: {
            maxYear: { gte: student.yearLevel },
            minYear: { lte: student.yearLevel },
        }
    }
    const enroledWhere = {
        enrolments: {
            some: {
                student: {
                    id: { equals: student.id }
                }
            }
        }
    }

    return (
        <DashboardLayout PageName="Students">
            <div className="py-4">
                <StudentForm student={{ ...student }} />
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <h2 className="text-2xl font-bold text-gray-900">Enroled Lessons</h2>
                    {/* @ts-expect-error Server Component */}
                    <LessonList where={enroledWhere} studentId={student.id} enroled={false} />
                </div>
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">

                    <h2 className="text-2xl font-bold text-gray-900">Available Lessons</h2>
                    {/* @ts-expect-error Server Component */}
                    <LessonList where={availableWhere} studentId={student.id} enroled={false} />
                </div>

            </div>
        </DashboardLayout>
    )
}
