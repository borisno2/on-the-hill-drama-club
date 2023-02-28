import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  IdentificationIcon,
  ScaleIcon,
  StopCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { getSessionContext } from 'keystone/context'
import DashboardLayout from './DashboardLayout'
import Link from 'next/link'
import { gql } from '@ts-gql/tag/no-transform'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
  ...getMetadata('Student Portal'),
}


const GET_STUDENT_ENROLMENTS = gql`
  query GET_STUDENT_ENROLMENTS {
    students {
      id
      firstName
      surname
      enrolments {
        id
        lessonTerm {
          id
          name
          lesson {
            id
            name
          }
        }
      }
    }
  }
` as import('../../../__generated__/ts-gql/GET_STUDENT_ENROLMENTS').type

export default async function Portal() {
  const context = await getSessionContext()
  const session = context.session as Session
  if (!session) {
    redirect('/auth/signin')
  }
  const accounts = await context.db.Account.findMany({
    where: { user: { id: { equals: session.userId } } },
  })

  if (!accounts || accounts.length === 0 || !accounts[0].id) {
    redirect('/api/auth/signout')
  }
  const profileComplete = Object.values(accounts[0]).every(
    (value) => value !== 'PLEASE_UPDATE'
  )
  if (!profileComplete) {
    // redirect to profile page if profile is not complete
    redirect('/dashboard/profile?incomplete=true')
  }

  const { students } = await context.graphql.run({
    query: GET_STUDENT_ENROLMENTS,
  })
  const cards = [
    //{ name: 'Account balance', href: '/dashboard/account', icon: ScaleIcon, amount: '$30,659.45' },
    {
      name: 'Students',
      href: '/dashboard/students',
      icon: UsersIcon,
      amount: students ? students.length : 0,
    },
    {
      name: 'Lessons',
      href: '/dashboard/lessons',
      icon: BuildingOfficeIcon,
      amount: students
        ? students.reduce(
          (acc, student) =>
            acc + (student.enrolments ? student.enrolments.length : 0),
          0
        )
        : 0,
    },
    // More items...
  ]
  return (
    <DashboardLayout PageName="Dashboard">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Student Portal
        </h3>
      </div>

      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <IdentificationIcon className="hidden h-16 w-16 rounded-full sm:block" />

                <div>
                  <div className="flex items-center">
                    <IdentificationIcon className="h-16 w-16 rounded-full sm:hidden" />
                    <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                      Hello, {context.session.data.firstName}
                    </h1>
                  </div>
                  <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                    <dt className="sr-only">Company</dt>
                    <Link href="/dashboard/profile">
                      <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                        <BuildingOfficeIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        Update Profile
                      </dd>
                    </Link>

                    <dt className="sr-only">Account status</dt>
                    <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                      {context.session.data.emailVerified ? (
                        <>
                          <CheckCircleIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                            aria-hidden="true"
                          />
                          <p>Verified account</p>
                        </>
                      ) : (
                        <>
                          <StopCircleIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-red-400"
                            aria-hidden="true"
                          />
                          <p>Unverified account</p>
                        </>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Overview
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card */}
            {cards.map((card) => (
              <div
                key={card.name}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <card.icon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {card.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {card.amount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a
                      href={card.href}
                      className="font-medium text-cyan-700 hover:text-cyan-900"
                    >
                      Manage
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
