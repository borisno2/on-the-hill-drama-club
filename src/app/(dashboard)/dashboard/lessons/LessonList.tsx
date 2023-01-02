import Link from "next/link";
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { getSessionContext } from "app/KeystoneContext";
import { LessonWhereInput } from "../../../../../__generated__/ts-gql/@schema";
import { GET_LESSONS } from "./queries";
import labelHelper from "lib/labelHelper";
import { formatDate } from "lib/formatDate";
import { lessonTypeOptions, lessonStatusOptions } from "types/selectOptions";
import EnrolButton from "components/EnrolButton";

export default async function ClassList({ where, studentId, enroled = false }: { where?: LessonWhereInput, studentId?: string, enroled?: boolean }) {
    const context = await getSessionContext();
    const { lessons } = await context.graphql.run({ query: GET_LESSONS, variables: { where } })
    return (
        <>
            {!lessons || lessons.length === 0 ? (<div className="px-4 py-5 sm:px-6"> No lessons Found</div>) : (
                <ul role="list" className="divide-y divide-gray-200">
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>
                            <Link href={`/dashboard/lessons/${lesson.id}${studentId !== undefined ? `?studentId=${studentId}` : ''}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-sm font-medium text-indigo-600">{lesson.name}</p>
                                        <div className="ml-2 flex flex-shrink-0">
                                            <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                {lesson.type ? labelHelper(lessonTypeOptions, lesson.type) : 'Other'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                {lesson.status ? labelHelper(lessonStatusOptions, lesson.status) : 'Upcoming'} {enroled && `- Enroled`} - Click to view lesson details
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                {lesson.location ? lesson.location : 'The Old Church on the Hill'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <p>
                                                Starts on <time dateTime={new Date(lesson.startDate).toUTCString()}>{formatDate(lesson.startDate)}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="float-right">
                                {studentId && !enroled ? (<EnrolButton studentId={studentId} lessonId={lesson.id} />) : null}
                            </div>
                        </li>
                    ))}
                </ul>)}
        </>
    )
}