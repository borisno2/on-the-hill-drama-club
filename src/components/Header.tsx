'use client'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BookmarkSquareIcon,
  CalendarIcon,
  CreditCardIcon,
  EyeIcon,
  GlobeAsiaAustraliaIcon,
  KeyIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  PhoneIcon,
  StarIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const lessons = [
  {
    name: 'On the Hill Drama Club',
    description: '',
    href: '/lessons/drama-club',
    icon: StarIcon,
  },
  {
    name: 'Only Strings',
    description: 'Orchestra',
    href: '/lessons/only-strings-orchestra',
    icon: GlobeAsiaAustraliaIcon,
  },
  {
    name: 'Drama Teens',
    description: 'Teen Theatre and Performance',
    href: '/lessons/drama-teens',
    icon: PaperAirplaneIcon,
  },
  {
    name: 'Advanced Actors',
    description: 'Advanced Theatre and Performance',
    href: '/lessons/advanced-actors',
    icon: KeyIcon,
  },
  {
    name: 'Theatre Making Workshops',
    description: 'Props, Costumes, Set and all things Theatre Making',
    href: '/lessons/theatre-making-workshops',
    icon: EyeIcon,
  },
]
const callsToAction = [
  { name: 'Enrol', href: '/dashboard', icon: PencilSquareIcon },
  { name: 'Contact', href: '/contact', icon: PhoneIcon },
]
const resources = [
  {
    name: 'Contact',
    description: 'Contact Information and Location',
    href: '/contact',
    icon: PhoneIcon,
  },
  {
    name: 'Term Dates',
    description: 'See upcoming Important Dates',
    href: '/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'About',
    description: 'Teaching Ethos and Values',
    href: '/about',
    icon: BookmarkSquareIcon,
  },
  {
    name: 'Billing and Accounts',
    description: 'Billing Policy including refunds and cancellations',
    href: '/fees',
    icon: CreditCardIcon,
  },
  {
    name: 'Enrol',
    description: 'Enrol in a Lesson or Workshop',
    href: '/dashboard',
    icon: PencilSquareIcon,
  },
  {
    name: 'Student Portal',
    description: 'Manage your Lessons and Account',
    href: '/dashboard',
    icon: Bars3Icon,
  },
  {
    name: 'Merch Store',
    description: 'Purchase Uniforms and Merchandise',
    href: 'https://merch.emilycalder.com.au',
    icon: ShoppingCartIcon,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const Header = () => {
  const { data: session } = useSession()
  return (
    <Popover className="relative z-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b-2 border-gray-100 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <span className="sr-only">On the Hill Drama Club</span>
              <Image
                className="mx-auto w-auto"
                src="/oth-logo.png"
                alt="On the Hill Drama Club"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden space-x-10 md:flex">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-gray-900' : 'text-gray-500',
                      'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    )}
                  >
                    <span>Lessons</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-600' : 'text-gray-400',
                        'ml-2 h-5 w-5 group-hover:text-gray-500',
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {lessons.map((item) => (
                            <Popover.Button
                              as={Link}
                              key={item.name}
                              href={item.href}
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                            >
                              <item.icon
                                className="h-6 w-6 flex-shrink-0 text-indigo-600"
                                aria-hidden="true"
                              />
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.description}
                                </p>
                              </div>
                            </Popover.Button>
                          ))}
                        </div>
                        <div className="space-y-6 bg-gray-50 px-5 py-5 sm:flex sm:space-x-10 sm:space-y-0 sm:px-8">
                          {callsToAction.map((item) => (
                            <div key={item.name} className="flow-root">
                              <Popover.Button
                                as={Link}
                                href={item.href}
                                className="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-100"
                              >
                                <item.icon
                                  className="h-6 w-6 flex-shrink-0 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-3">{item.name}</span>
                              </Popover.Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>

            <Link
              href="/fees"
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              Fees
            </Link>
            <Link
              href="/timetable"
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              Timetable
            </Link>

            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-gray-900' : 'text-gray-500',
                      'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    )}
                  >
                    <span>More</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-600' : 'text-gray-400',
                        'ml-2 h-5 w-5 group-hover:text-gray-500',
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {resources.map((item) => (
                            <Popover.Button
                              as={Link}
                              key={item.name}
                              href={item.href}
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                            >
                              <item.icon
                                className="h-6 w-6 flex-shrink-0 text-indigo-600"
                                aria-hidden="true"
                              />
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.description}
                                </p>
                              </div>
                            </Popover.Button>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </Popover.Group>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pb-6 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <Image
                    className="mx-auto w-auto"
                    src="/oth-logo.png"
                    alt="On the Hill Drama Club"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {lessons.map((item) => (
                    <Popover.Button
                      as={Link}
                      key={item.name}
                      href={item.href}
                      className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                    >
                      <item.icon
                        className="h-6 w-6 flex-shrink-0 text-indigo-600"
                        aria-hidden="true"
                      />
                      <span className="ml-3 text-base font-medium text-gray-900">
                        {item.name}
                      </span>
                    </Popover.Button>
                  ))}
                </nav>
              </div>
            </div>
            <div className="space-y-6 px-5 py-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <Popover.Button
                  as={Link}
                  href="/fees"
                  className="text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Fees
                </Popover.Button>

                <Popover.Button
                  as={Link}
                  href="/timetable"
                  className="text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Timetable
                </Popover.Button>
                {resources.map((item) => (
                  <Popover.Button
                    as={Link}
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    {item.name}
                  </Popover.Button>
                ))}
              </div>
              <div>
                {session ? (
                  <>
                    <a
                      onClick={() => signOut()}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100"
                    >
                      Sign Out
                    </a>
                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                      Existing customer?{' '}
                      <Popover.Button
                        as={Link}
                        href="/dashboard"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Student Portal
                      </Popover.Button>
                    </p>
                  </>
                ) : (
                  <>
                    <Popover.Button
                      as={Link}
                      href="/auth/register"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Sign up
                    </Popover.Button>
                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                      Existing account?{' '}
                      <Popover.Button
                        as={Link}
                        href="/auth/signin"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Sign in
                      </Popover.Button>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
