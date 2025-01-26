import Link from 'next/link'
import StudentList from './StudentList'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
  ...getMetadata('Students - Student Portal'),
}

export default async function Students() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the Students associated with your account.
          </p>
        </div>
        <div className="mt-4 flex sm:ml-16 sm:mt-0 sm:flex-none">
          <div className="px-2 sm:ml-3 sm:block">
            <Link
              type="button"
              href="/dashboard/students/add"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add New Student
            </Link>
          </div>
          <div className="px-2 sm:ml-3 sm:block">
            <Link
              type="button"
              href="/dashboard/students/chat"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Enrol using Chat
            </Link>
          </div>
        </div>
      </div>
      <StudentList />
    </div>
  )
}
