import DashboardLayout from '../../DashboardLayout'
import { getSessionContext } from 'keystone/context'
import StudentForm from '../StudentForm'

import { redirect } from 'next/navigation'
import { isCuid } from 'cuid'

import LessonList from '../../lessons/LessonList'
import { GET_STUDENT_BY_ID } from '../queries'
import { Session } from 'next-auth'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Student Portal'),
}

export const dynamic = 'force-dynamic'
export default async function Students({
    params,
}: {
    params: { id?: string }
}) {
    if (!params.id || !isCuid(params.id)) {
        redirect('/dashboard/students')
    }
    const context = await getSessionContext()
    const session: Session = context.session
    const { student } = await context.graphql.run({
        query: GET_STUDENT_BY_ID,
        variables: { id: params.id },
    })
    if (!student) {
        redirect('/dashboard/students')
    }
    const availableWhere = {
        AND: {
            status: { in: ['UPCOMING', 'ENROL'] },
            lesson: {
                maxYear: { gte: student.yearLevel },
                minYear: { lte: student.yearLevel },

            },
            enrolments: {
                none: {
                    student: {
                        id: { equals: student.id }
                    }
                }
            }
        }
    }
    const enroledWhere = {
        enrolments: {
            some: {
                AND: [
                    {
                        status: { equals: 'ENROLED' }
                    },
                    {
                        student: {
                            id: { equals: student.id }
                        }
                    }]
            }
        }
    }

    const pendingWhere = {
        enrolments: {
            some: {
                AND: [
                    {
                        status: { equals: 'PENDING' }
                    },
                    {
                        student: {
                            id: { equals: student.id }
                        }
                    }]
            }
        }
    }

    return (
        <DashboardLayout PageName="Students">
            <div className="py-4">
                <StudentForm student={{ ...student }} accountId={session.data.accountId!} />
                <div className="py-5 space-y-8 divide-y divide-gray-200 sm:space-y-5">

                    <h2 className="text-2xl font-bold text-gray-900">Lessons Pending</h2>
                    <p className="text-sm text-gray-500">Lessons pending confirmation from Emily</p>

                    {/* @ts-expect-error Server Component */}
                    <LessonList where={pendingWhere} studentId={student.id} enroled={true} />
                </div>
                <div className="py-5 space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <h2 className="text-2xl font-bold text-gray-900">Confirmed Enroled Lessons</h2>
                    <p className="text-sm text-gray-500">Lessons confirmed by Emily</p>

                    {/* @ts-expect-error Server Component */}
                    <LessonList where={enroledWhere} studentId={student.id} enroled={true} />
                </div>
                <div className="py-5 space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <h2 className="text-2xl font-bold text-gray-900">Available Lessons</h2>
                    <p className="text-sm text-gray-500">Lessons that match this students class year</p>

                    {/* @ts-expect-error Server Component */}
                    <LessonList where={availableWhere} studentId={student.id} enroled={false} />
                </div>

            </div>
        </DashboardLayout>
    )
}
