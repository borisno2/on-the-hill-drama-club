'use client'

import React, { Fragment } from 'react'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { IdentificationIcon } from '@heroicons/react/24/outline'
import { signOut } from 'lib/authActions'
import { redirect } from 'next/navigation'

const userNavigation = [
  { name: 'Your Profile', href: '/dashboard/profile' },
  //{ name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function ProfileDropdown() {
  return (
    <Menu as="div" className="relative ml-3 md:px-8">
      <div>
        <MenuButton className="bottom-5 left-10 flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:fixed">
          <span className="sr-only">Open user menu</span>
          <IdentificationIcon className="inline-block h-9 w-9 rounded-full" />
        </MenuButton>
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
        <MenuItems className="absolute bottom-10 left-10 z-10 mt-2 w-48 origin-bottom-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {userNavigation.map((item) => (
            <MenuItem key={item.name}>
              {item.name === 'Sign out' ? (
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  onClick={async () => {
                    await signOut()
                  }}
                >
                  {item.name}
                </button>
              ) : (
                <button
                  onClick={() => redirect(item.href)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  {item.name}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  )
}
