'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ErrorPop from 'components/ErrorPop'
import SuccessPop from 'components/SuccessPop'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type Values } from './profileSchema'
import { updateProfileAction } from './updateProfileAction'
import { useActionState } from 'react'
import { formOnSubmit } from 'lib/utils'

type User = {
  id: string
  firstName: string | null
  surname: string | null
  email: string | null
  phone: string | null
  suburb: string | null
  postcode: number | null
  streetAddress: string | null
  secondContactName: string | null
  secondContactPhone: string | null
}

export default function ProfileForm({
  user,
  redirectOnSave,
}: {
  user: User
  redirectOnSave: boolean
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, pending] = useActionState(updateProfileAction, {
    message: '',
  })

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const defaultValues = {
    firstName: user.firstName || '',
    surname: user.surname || '',
    phone: user.phone || '',
    suburb: user.suburb || '',
    postcode: user.postcode?.toString() || '3550',
    streetAddress: user.streetAddress || '',
    secondContactName: user.secondContactName || '',
    secondContactPhone: user.secondContactPhone || '',
    ...(state?.fields ?? {}),
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (state?.message === 'Success') {
      setSuccess(true)
      if (redirectOnSave) {
        router.push('/dashboard')
      }
    } else if (state?.message !== '') {
      setError(true)
    }
  }, [state?.message, redirectOnSave, router])

  return (
    <>
      <form
        action={formAction}
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={formOnSubmit(handleSubmit, isValid)}
        ref={formRef}
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Use a permanent address where you can receive mail.
              </p>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Email address
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  readOnly={true}
                  value={user.email as string}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  First name
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    {...register('firstName')}
                    title="First Name"
                    autoComplete="given-name"
                    type="text"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.firstName && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.firstName.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Surname
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    title="Last Name"
                    {...register('surname')}
                    autoComplete="family-name"
                    type="text"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.surname && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.surname.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Phone Number
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    {...register('phone')}
                    title="phone"
                    type="text"
                    autoComplete="tel"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.phone && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.phone.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="secondContactName"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Secondary Contact Name
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    {...register('secondContactName')}
                    title="Second Contact Name"
                    type="text"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.secondContactName && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.secondContactName.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="secondContactPhone"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Secondary Contact Phone Number
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    {...register('secondContactPhone')}
                    type="text"
                    title="secondContactPhone"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.secondContactPhone && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.secondContactPhone.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="streetAddress"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Street address
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    {...register('streetAddress')}
                    title="Street Address"
                    type="text"
                    autoComplete="street-address"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.streetAddress && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.streetAddress.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="suburb"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Suburb
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    {...register('suburb')}
                    title="Suburb"
                    type="text"
                    autoComplete="address-level2"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.suburb && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.suburb.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="postcode"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Postcode
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    title="Post Code"
                    {...register('postcode')}
                    type="number"
                    autoComplete="postal-code"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.postcode && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.postcode.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {state?.issues && (
          <div className="text-red-500">
            <ul>
              {state.issues.map((issue) => (
                <li key={issue.code} className="flex gap-1">
                  {issue.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {pending ? 'Loading...' : 'Save'}
            </button>
          </div>
        </div>
      </form>

      <SuccessPop success={success} setSuccess={setSuccess} />
      <ErrorPop error={error} setError={setError} />
    </>
  )
}
