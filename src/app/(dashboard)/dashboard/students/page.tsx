import DashboardLayout from "../../DashboardLayout"
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { getSessionContext } from "app/KeystoneContext";
import Link from "next/link";
import { gql } from "@ts-gql/tag/no-transform";

const GET_STUDENTS = gql`
    query GET_STUDENTS {
        students {
            id
            firstName
            surname
            dateOfBirth
            }
            }`as import("../../../../../__generated__/ts-gql/GET_STUDENTS").type
export default async function Students() {
    const context = await getSessionContext();
    const { students } = await context.graphql.run({ query: GET_STUDENTS })

    return (
        <DashboardLayout PageName="Students"><div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Students</h3>
                </div>
                <div className="ml-4 mt-2 flex-shrink-0">

                    <Link
                        type="button"
                        href="/dashboard/students/add"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add New Student
                    </Link>
                </div>
            </div>
        </div>
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                {!students || students.length === 0 ? (<div className="px-4 py-5 sm:px-6"> No Students Found</div>) : (
                    <ul role="list" className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <li key={student.id}>
                                <Link href={`/dashboard/students/${student.id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-medium text-indigo-600">{student.firstName}</p>
                                            <div className="ml-2 flex flex-shrink-0">
                                                <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    Student Type
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    Student Department
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    Location
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                <p>
                                                    Closing on <time dateTime={new Date().toUTCString()}>{new Date().toUTCString()}</time>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>)}
            </div>

        </DashboardLayout>
    )
}
