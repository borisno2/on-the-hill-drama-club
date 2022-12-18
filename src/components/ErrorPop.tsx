import { XCircleIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'


export default function Example({ error, setError }: { error: boolean, setError: (error: boolean) => void }) {
    return (
        <Transition.Root show={error} as={Fragment}>
            <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" onClick={() => setError(false)} />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Oops... There was an errors with your submission</h3>
                    </div>
                </div>
            </div>
        </Transition.Root>
    )
}
