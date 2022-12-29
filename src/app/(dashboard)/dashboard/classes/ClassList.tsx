import Link from "next/link";
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { getSessionContext } from "app/KeystoneContext";
import { ClassWhereInput } from "../../../../../__generated__/ts-gql/@schema";
import { GET_CLASSES } from "./queries";
import labelHelper from "lib/labelHelper";

const classTypes = [
    { label: 'Term', value: 'TERM' },
    { label: 'Holiday', value: 'HOLIDAY' },
    { label: 'Trial', value: 'TRIAL' },
    { label: 'Once Off', value: 'ONCE' },
    { label: 'Other', value: 'OTHER' }
]
const classStatus = [
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Current', value: 'CURRENT' },
    { label: 'Enrolments Open', value: 'ENROL' },
    { label: 'Previous', value: 'PREVIOUS' },
]

export default async function ClassList({ where, studentId, enrolled = false }: { where?: ClassWhereInput, studentId?: string, enrolled?: boolean }) {
    const context = await getSessionContext();
    const { classes } = await context.graphql.run({ query: GET_CLASSES, variables: { where } })
    return (
        <>
            {!classes || classes.length === 0 ? (<div className="px-4 py-5 sm:px-6"> No Classes Found</div>) : (
                <ul role="list" className="divide-y divide-gray-200">
                    {classes.map((oneClass) => (
                        <li key={oneClass.id}>
                            <Link href={`/dashboard/classes/${oneClass.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-sm font-medium text-indigo-600">{oneClass.name}</p>
                                        <div className="ml-2 flex flex-shrink-0">
                                            <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                {oneClass.type ? labelHelper(classTypes, oneClass.type) : 'Other'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                {oneClass.status ? labelHelper(classStatus, oneClass.status) : 'Upcoming'}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                {oneClass.location ? oneClass.location : 'The Old Church on the Hill'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <p>
                                                Starts on <time dateTime={new Date(oneClass.startDate).toUTCString()}>{new Date(oneClass.startDate).toUTCString()}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>)}
        </>
    )
}