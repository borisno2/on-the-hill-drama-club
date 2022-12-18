import DashboardLayout from "../../DashboardLayout"
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { getSessionContext } from "app/KeystoneContext";
import Link from "next/link";

export default async function Students() {
    const context = await getSessionContext();
    const students = await context.query.Student.findMany({ query: 'name id' })

    return (
        <DashboardLayout PageName="Students">
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {students.map((student) => (
                        <li key={student.id}>
                            <Link href={`/dashboard/students/${student.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-sm font-medium text-indigo-600">{student.name}</p>
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
                </ul>
            </div>
            <Link
                type="button"
                href="/dashboard/students/add"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Add New
            </Link>

        </DashboardLayout>
    )
}
