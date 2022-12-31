import DashboardLayout from '../../../DashboardLayout'
import { getSessionContext } from 'app/KeystoneContext'

import { redirect } from 'next/navigation'
import { isCuid } from 'cuid'

import { GET_CLASS_BY_ID } from '../queries'
import { GET_STUDENT_BY_ID } from '../../students/queries'


export default async function ClassPage({
    params,
    searchParams,
}: {
    params: { id?: string }
    searchParams: { studentId?: string }
}) {
    if (!params.id || !isCuid(params.id)) {
        redirect('/dashboard/classes')
    }
    const context = await getSessionContext()
    let studentData: typeof GET_STUDENT_BY_ID['___type']['result']
    if (searchParams.studentId && isCuid(searchParams.studentId)) {
        studentData = await context.graphql.run({
            query: GET_STUDENT_BY_ID,
            variables: { id: searchParams.studentId },
        })
    }

    const classData = await context.graphql.run({
        query: GET_CLASS_BY_ID,
        variables: { id: params.id },
    })
    if (!classData.class) {
        redirect('/dashboard/students')
    }

    return (
        <DashboardLayout PageName="Classes">
            <div className="py-4">
                <h1 className="text-2xl font-bold text-gray-900">{classData.class.name}</h1>
                <p className="text-sm text-gray-500">Year {classData.class.minYear} - {classData.class.maxYear}</p>
                <p className="text-sm text-gray-500">Description: {classData.class.description}</p>

            </div>
        </DashboardLayout>
    )
}
