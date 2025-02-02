import ClassList from './LessonList'
import { getSessionContext } from 'keystone/context'
import { GET_STUDENTS } from '../students/queries'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'
import { VariablesOf } from 'gql'
import { GET_LESSONS } from './queries'

export const metadata: Metadata = {
  ...getMetadata('Lessons - Student Portal'),
}

export default async function lessons() {
  const context = await getSessionContext()
  const { session } = context
  if (!session) {
    redirect('/auth/signin')
  }
  const { students } = await context.graphql.run({ query: GET_STUDENTS })
  if (!students || students.length === 0) {
    redirect('/dashboard/students')
  }
  // get a list of students year levels
  const yearLevels = students ? students.map((student) => student.age) : []
  const studentIds = students ? students.map((student) => student.id) : []
  // remove duplicates
  const uniqueYearLevels = [...new Set(yearLevels)]
  // create a class where clause to filter lessons by year level
  let availableWhere: VariablesOf<typeof GET_LESSONS>['where'] = {}
  let enroledWhere: VariablesOf<typeof GET_LESSONS>['where'] = {}
  if (uniqueYearLevels.length > 0) {
    if (studentIds.length > 0) {
      enroledWhere = {
        AND: [
          { status: { in: ['UPCOMING', 'ENROL'] } },
          { enrolments: { some: { student: { id: { in: studentIds } } } } },
        ],
      }
    }
    availableWhere = {
      AND: [
        {
          NOT: [enroledWhere],
        },
        {
          status: { in: ['UPCOMING', 'ENROL'] },
        },
        {
          lesson: {
            OR: uniqueYearLevels.map((yearLevel) => ({
              AND: [
                { maxYear: { gte: yearLevel } },
                { minYear: { lte: yearLevel } },
              ],
            })),
          },
        },
      ],
    }
  }
  const allWhere: VariablesOf<typeof GET_LESSONS>['where'] = {
    AND: [
      {
        NOT: [
          {
            OR: [availableWhere, enroledWhere],
          },
        ],
      },
      { status: { in: ['UPCOMING', 'ENROL'] } },
    ],
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Enrolled Classes</h2>
        <p className="text-sm text-gray-500">
          This is a list of all lessons that you have one or more student
          enrolled in
        </p>
        <ClassList where={enroledWhere} enroled={true} />
      </div>
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Available Lessons</h2>
        <p className="text-sm text-gray-500">
          This is a list of all lessons that are suitable for one of more your
          Students based on their class year level, except those listed above
          where you already have a Student enrolled
        </p>
        <ClassList where={availableWhere} enroled={false} />
      </div>

      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">All Lessons</h2>
        <p className="text-sm text-gray-500">
          This is a list of all lessons, except those you have a student
          enrolled in or a suitably aged student for.
        </p>
        <ClassList where={allWhere} enroled={false} />
      </div>
    </div>
  )
}
