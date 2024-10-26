import { getSessionContext } from 'keystone/context'
import EnrolButton from '../EnrolButton'
import labelHelper from 'lib/labelHelper'
import { redirect } from 'next/navigation'
import { type GET_LESSON_BY_ID } from '../queries'
import { enrolmentStatusOptions } from 'types/selectOptions'
import { type ResultOf, graphql } from 'gql'

const GET_STUDENTS_ENROLMENTS = graphql(`
  query GET_STUDENTS_ENROLMENTS($minYear: Int!, $maxYear: Int!) {
    students(
      where: {
        AND: [
          { yearLevel: { gte: $minYear } }
          { yearLevel: { lte: $maxYear } }
        ]
      }
    ) {
      id
      firstName
      yearLevel
      surname
      enrolments {
        id
        status
        lessonTerm {
          id
          name
        }
      }
    }
  }
`)

export default async function StudentList({
  lessonTerm,
}: {
  lessonTerm: NonNullable<ResultOf<typeof GET_LESSON_BY_ID>['lessonTerm']>
}) {
  const context = await getSessionContext()
  if (
    lessonTerm.lesson?.maxYear === null ||
    !(lessonTerm.lesson?.minYear === null)
  ) {
    redirect('/dashboard/lessons')
  }
  const { students } = await context.graphql.run({
    query: GET_STUDENTS_ENROLMENTS,
    variables: {
      minYear: lessonTerm.lesson!.minYear!,
      maxYear: lessonTerm.lesson!.maxYear!,
    },
  })
  return (
    <div className="mt-8 flex flex-col">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    First Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Surname
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    School Year Level
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Enrol</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Enrol</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {students ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {student.firstName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {student.surname}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {student.yearLevel}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {student.enrolments?.some(
                          (enrolment) =>
                            enrolment.lessonTerm?.id === lessonTerm.id,
                        ) ? (
                          <p>
                            {' '}
                            Enrolment Status -{' '}
                            {labelHelper(
                              enrolmentStatusOptions,
                              student.enrolments?.find(
                                (enrolment) =>
                                  enrolment.lessonTerm?.id === lessonTerm.id,
                              )?.status || 'ERROR',
                            )}
                          </p>
                        ) : (
                          <EnrolButton
                            studentId={student.id}
                            lessonId={lessonTerm.id}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
