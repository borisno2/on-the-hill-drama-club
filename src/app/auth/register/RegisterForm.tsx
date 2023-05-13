'use client'
import { signIn } from 'next-auth/react'
import { useRef, useState } from 'react'
import ErrorPop from 'components/ErrorPop'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerAccount } from './_action'

interface Values {
  firstName: string
  surname: string
  password: string
  passwordConfirmation: string
  email: string
  phone: string
  secondContactName: string
  secondContactPhone: string
  suburb: string
  postcode: number
  streetAddress: string
  turnstileRes: string
}

const registerSchema = z
  .object({
    turnstileRes: z.string(),
    firstName: z.string().min(1, { message: 'Please enter your first name' }),
    secondContactName: z
      .string()
      .min(1, { message: 'Please enter the name of a secondary contact' }),
    secondContactPhone: z
      .string()
      .length(10, { message: 'Please enter a valid 10 digit phone number' })
      .regex(/^\d+$/, {
        message: 'Please enter a valid 10 digit phone number',
      }),
    surname: z.string().min(1, { message: 'Please enter your surname' }),
    phone: z
      .string()
      .length(10, { message: 'Please enter a valid 10 digit phone number' })
      .regex(/^\d+$/, {
        message: 'Please enter a valid 10 digit phone number',
      }),
    suburb: z.string().min(1, { message: 'Please enter your Suburb' }),
    postcode: z
      .number()
      .min(1000, { message: 'Please enter a valid postcode' })
      .max(9999, { message: 'Please enter a valid postcode' }),
    streetAddress: z
      .string()
      .min(5, { message: 'Please enter your Street Address' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        path: ['passwordConfirmation'],
        code: 'custom',
        message: 'The passwords did not match',
      })
    }
  })

export default function RegisterForm() {
  const ref = useRef<TurnstileInstance | undefined>(null)
  const [isSubmitting, setSubmitting] = useState(false)

  const [error, setError] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(registerSchema) })

  const onSubmit: SubmitHandler<Values> = async (values: Values) => {
    setSubmitting(true)
    const data = values
    ref.current?.reset()
    try {
      const result = await registerAccount(data)
      if (!result.success) {
        setError(true)
        throw new Error(result.error)
      }
      const newToken = ref.current?.getResponse()
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/dashboard/students/add',
        turnstileRes: newToken,
      })
    } catch (error) {
      setError(true)
      setSubmitting(false)
      throw error
    }
  }

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Please use your details here, the next step will be to add each
                individual student&apos;s details
              </p>
            </div>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your First Name
                </label>
                <input
                  title="Please enter your first name."
                  {...register('firstName')}
                  autoComplete="given-name"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                {errors.firstName && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.firstName.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Last Name
                </label>
                <input
                  title="Please enter your last name."
                  {...register('surname')}
                  autoComplete="family-name"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                {errors.surname && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.surname.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  title="Please enter a valid phone number."
                  {...register('phone')}
                  autoComplete="phone"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.phone && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.phone.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  title="Please enter a valid email address."
                  {...register('email')}
                  autoComplete="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.email && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="new-password"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.password && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="passwordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  title="Passwords must match."
                  {...register('passwordConfirmation')}
                  type="password"
                  autoComplete="new-password"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                {errors.passwordConfirmation && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.passwordConfirmation.message}
                  </div>
                )}
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="streetAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street address
                </label>
                <input
                  title="Please enter a valid street address."
                  {...register('streetAddress')}
                  type="text"
                  name="streetAddress"
                  id="streetAddress"
                  autoComplete="street-address"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.streetAddress && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.streetAddress.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <label
                  htmlFor="suburb"
                  className="block text-sm font-medium text-gray-700"
                >
                  Suburb
                </label>
                <input
                  title="Please enter a valid suburb."
                  {...register('suburb')}
                  type="text"
                  name="suburb"
                  id="suburb"
                  autoComplete="address-level2"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.suburb && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.suburb.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <label
                  htmlFor="postcode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Postcode
                </label>
                <input
                  title="Please enter a valid postcode."
                  {...register('postcode', {
                    valueAsNumber: true,
                  })}
                  type="number"
                  autoComplete="postal-code"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.postcode && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.postcode.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="secondContactName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Secondary Contact Name
                </label>
                <input
                  title="Please a secondary contact name."
                  {...register('secondContactName')}
                  type="text"
                  name="secondContactName"
                  id="secondContactName"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.secondContactName && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.secondContactName.message}
                  </div>
                )}
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="secondContactPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Secondary Contact Phone Number
                </label>
                <input
                  title="Please a secondary contact name."
                  {...register('secondContactPhone')}
                  type="text"
                  name="secondContactPhone"
                  id="secondContactPhone"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {errors.secondContactPhone && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.secondContactPhone.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Turnstile
            className="flex justify-center"
            ref={ref}
            options={{ theme: 'light', responseFieldName: 'turnstileRes' }}
            siteKey={
              process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
              '1x00000000000000000000AA'
            }
            onSuccess={(token: any) => setValue('turnstileRes', token)}
          />

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              disabled={isSubmitting}
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Loading...' : 'Next'}
            </button>
          </div>
        </div>
      </form>

      <ErrorPop error={error} setError={setError} />
    </>
  )
}
