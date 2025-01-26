import Link from 'next/link'
import {
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from '@heroicons/react/20/solid'
import { getSessionContext } from 'keystone/context'
import { GET_LESSONS } from './queries'
import labelHelper from 'lib/labelHelper'
import { formatDate } from 'lib/formatDate'
import { lessonTypeOptions, lessonStatusOptions } from 'types/selectOptions'
import EnrolButton from './EnrolButton'
import { teacherNameHelper } from 'lib/utils'
import { VariablesOf } from 'gql'

export default async function ClassList({
  where,
  studentId,
  enroled = false,
}: {
  where?: VariablesOf<typeof GET_LESSONS>['where']
  studentId?: string
  enroled?: boolean
}) {
  const context = await getSessionContext()
  const { lessonTerms } = await context.graphql.run({
    query: GET_LESSONS,
    variables: { where },
  })
  return (
    <>
      {!lessonTerms || lessonTerms.length === 0 ? (
        <div className="px-4 py-5 sm:px-6"> No lessons Found</div>
      ) : (
        <ul role="list" className="divide-y divide-gray-200">
          {lessonTerms.map((lesson) => (
            <li key={lesson.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/lessons/${lesson.id}${
                      studentId !== undefined ? `?studentId=${studentId}` : ''
                    }`}
                    className="block hover:bg-gray-50"
                  >
                    <p className="truncate text-sm font-medium text-indigo-600">
                      {lesson.name}
                    </p>
                  </Link>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {lesson.lesson?.lessonCategory?.type
                        ? labelHelper(
                            lessonTypeOptions,
                            lesson.lesson?.lessonCategory?.type,
                          )
                        : 'Other'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <UsersIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {lesson.status
                        ? labelHelper(lessonStatusOptions, lesson.status)
                        : 'Upcoming'}{' '}
                      {enroled && `- Enroled`} - Click to view lesson details
                    </p>
                    <p className="flex items-center text-sm text-gray-500">
                      <StarIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      Taught by {teacherNameHelper(lesson.lesson?.teachers)}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0">
                      <MapPinIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {lesson.lesson?.location
                        ? lesson.lesson.location
                        : 'The Old Church on the Hill'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CalendarIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <p>
                      Starts on{' '}
                      <time
                        dateTime={new Date(
                          lesson.term?.startDate as string,
                        ).toUTCString()}
                      >
                        {formatDate(lesson.term?.startDate as string)}
                      </time>
                    </p>
                    <div className="float-right">
                      {studentId && !enroled ? (
                        <EnrolButton
                          studentId={studentId}
                          lessonId={lesson.id}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
