"use client"

import React, { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import {
    IdentificationIcon,
} from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'

const userNavigation = [
    { name: 'Your Profile', href: '/dashboard/profile' },
    //{ name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ProfileDropdown() {
    return (

        <Menu as="div" className="relative ml-3 md:px-8">
            <div>
                <Menu.Button className="bottom-5 left-10 md:fixed flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <IdentificationIcon
                        className="inline-block h-9 w-9 rounded-full"
                    />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute bottom-10 left-10 z-10 mt-2 w-48 origin-bottom-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                            {({ active }) => (
                                <>
                                    {item.name === 'Sign out' ? (
                                        <button
                                            type='button'
                                            className={classNames(
                                                active ? 'bg-gray-100' : '',
                                                'block px-4 py-2 text-sm text-gray-700'
                                            )}
                                            onClick={() => signOut()}>
                                            {item.name}
                                        </button>) : (
                                        <a
                                            href={item.href}
                                            className={classNames(
                                                active ? 'bg-gray-100' : '',
                                                'block px-4 py-2 text-sm text-gray-700'
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                    )}

                                </>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>


    )
}