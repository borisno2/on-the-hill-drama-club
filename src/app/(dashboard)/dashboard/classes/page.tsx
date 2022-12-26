import DashboardLayout from "../../DashboardLayout"
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { getSessionContext } from "app/KeystoneContext";
import Link from "next/link";
import { gql } from "@ts-gql/tag/no-transform";

const GET_CLASSES = gql`
    query GET_CLASSES {
        classes {
            id
            name
            }
            }`as import("../../../../../__generated__/ts-gql/GET_CLASSES").type

export default async function Classess() {
    const context = await getSessionContext();
    const { classes } = await context.graphql.run({ query: GET_CLASSES })

    return (
        <DashboardLayout PageName="Classes">
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                {!classes || classes.length === 0 ? (<div className="px-4 py-5 sm:px-6"> No oneClasss Found</div>) : (
                    <ul role="list" className="divide-y divide-gray-200">
                        {classes.map((oneClass) => (
                            <li key={oneClass.id}>
                                <Link href={`/dashboard/classes/${oneClass.id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-medium text-indigo-600">{oneClass.name}</p>
                                            <div className="ml-2 flex flex-shrink-0">
                                                <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    oneClass Type
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    oneClass Department
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
