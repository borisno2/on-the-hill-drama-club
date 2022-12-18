import DashboardLayout from "../../../DashboardLayout"
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { getSessionContext } from "app/KeystoneContext";
import Link from "next/link";
import { redirect } from 'next/navigation';
import { isCuid } from "lib/isCuid";
export default async function Students({ params }: { params: { id?: string } }) {
    if (!params.id || !isCuid(params.id)) {
        redirect('/dashboard/students')
    }
    const context = await getSessionContext();
    const student = await context.query.Student.findOne({ where: { id: params.id }, query: 'name id' })
    if (!student) {
        redirect('/dashboard/students')
    }

    return (
        <DashboardLayout PageName="Students">
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
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
                                        <time dateTime="2020-01-07">Joined on 7 Jan 2020</time>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>


        </DashboardLayout>
    )
}
