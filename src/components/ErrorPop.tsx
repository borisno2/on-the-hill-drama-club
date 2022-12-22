"use client"
import { XCircleIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'


export default function ErrorPop({ error, setError }: { error: boolean, setError: (error: boolean) => void }) {
    return (
        <>
            <Transition.Root show={error} as={Fragment}>
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
        </>
    )
}
