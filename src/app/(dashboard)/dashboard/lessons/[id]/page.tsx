import DashboardLayout from '../../../DashboardLayout'
import { getSessionContext } from 'app/KeystoneContext'

import { redirect } from 'next/navigation'
import { isCuid } from 'cuid'

import { GET_LESSON_BY_ID } from '../queries'
import { GET_STUDENT_BY_ID } from '../../students/queries'
import { Suspense } from 'react'
import EnrolStudentList from './EnrolStudentList'
import { OperationData } from '@ts-gql/tag'


export default async function LessonPage({
    params,
    searchParams,
}: {
    params: { id?: string }
    searchParams: { studentId?: string }
}) {
    if (!params.id || !isCuid(params.id)) {
        redirect('/dashboard/lessons')
    }
    const context = await getSessionContext()
    let studentData: Promise<OperationData<typeof GET_STUDENT_BY_ID>> = Promise.resolve({ __typename: 'Query', student: null })
    if (searchParams.studentId && isCuid(searchParams.studentId)) {
        studentData = context.graphql.run({
            query: GET_STUDENT_BY_ID,
            variables: { id: searchParams.studentId },
        })
    }

    const lessonData = context.graphql.run({
        query: GET_LESSON_BY_ID,
        variables: { id: params.id },
    })
    const [{ lesson }, { student }] = await Promise.all([lessonData, studentData])
    if (!lesson) {
        redirect('/dashboard/students')
    }

    return (
        <DashboardLayout PageName="Lessons">
            <div className="py-4">
                <Suspense fallback={<div>Loading...</div>}>
                    <h1 className="text-2xl font-bold text-gray-900">{lesson.name}</h1>

                    <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Day of the Week</dt>
                                <dd className="mt-1 text-sm text-gray-900">{lesson.day}</dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Time of the Day</dt>
                                <dd className="mt-1 text-sm text-gray-900">{lesson.time}</dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Year Level</dt>
                                <dd className="mt-1 text-sm text-gray-900">{lesson.minYear} - {lesson.maxYear}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Cost Per Lesson</dt>
                                <dd className="mt-1 text-sm text-gray-900">${lesson.cost}</dd>
                            </div>

                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd
                                    className="mt-1 max-w-prose space-y-5 text-sm text-gray-900"
                                />
                                {lesson.description}
                            </div>
                        </dl>
                        {/* @ts-expect-error Server Component */}
                        <EnrolStudentList studentId={student?.id} />
                    </div>
                </Suspense>
            </div>
        </DashboardLayout>
    )
}
