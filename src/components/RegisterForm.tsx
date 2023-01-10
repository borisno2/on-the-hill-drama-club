'use client'
import { signIn } from 'next-auth/react'
import { useRef, useState } from 'react'
import ErrorPop from './ErrorPop'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { Formik, FormikHelpers } from 'formik'
import { z } from 'zod'

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

export default function RegisterForm() {
    const ref = useRef<TurnstileInstance | undefined>(null)
    const initialValues = {
        firstName: '',
        surname: '',
        phone: '',
        suburb: '',
        secondContactName: '',
        secondContactPhone: '',
        postcode: 3550,
        streetAddress: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        turnstileRes: '',
    }

    const [error, setError] = useState(false)
    const onSubmit = async (
        values: Values,
        { setSubmitting }: FormikHelpers<Values>
    ) => {
        setSubmitting(true)
        const data = values
        ref.current?.reset()
        try {
            const result = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            if (!result.ok) {
                setError(true)
                throw new Error(result.statusText)
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
    const validate = (values: Values) => {
        const errors: Partial<Values> = {}
        const registerSchema = z
            .object({
                turnstileRes: z.string(),
                firstName: z
                    .string()
                    .min(1, { message: 'Please enter your first name' }),
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
                email: z
                    .string()
                    .email({ message: 'Please enter a valid email address' }),
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
        const result = registerSchema.safeParse(values)
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                // @ts-ignore
                errors[issue.path[0]] = issue.message
            })
        }
        return errors
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
            }) => (
                <>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="shadow sm:overflow-hidden sm:rounded-md">
                            <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Personal Information
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Please use your details here, the next step will be to add each individual student&apos;s details
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
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            autoComplete="given-name"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {touched.firstName && errors.firstName && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.firstName}
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
                                            value={values.surname}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="surname"
                                            id="surname"
                                            autoComplete="family-name"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {touched.surname && errors.surname && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.surname}
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
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            autoComplete="phone"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.phone && errors.phone && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.phone}
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
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="email"
                                            id="email"
                                            autoComplete="email"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.email && errors.email && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.email}
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
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="password"
                                            name="password"
                                            id="password"
                                            autoComplete="new-password"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.password && errors.password && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.password}
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
                                            value={values.passwordConfirmation}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="password"
                                            name="passwordConfirmation"
                                            id="passwordConfirmation"
                                            autoComplete="new-password"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {touched.passwordConfirmation &&
                                            errors.passwordConfirmation && (
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.passwordConfirmation}
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
                                            value={values.streetAddress}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="streetAddress"
                                            id="streetAddress"
                                            autoComplete="street-address"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.streetAddress && errors.streetAddress && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.streetAddress}
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
                                            value={values.suburb}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="suburb"
                                            id="suburb"
                                            autoComplete="address-level2"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.suburb && errors.suburb && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.suburb}
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
                                            value={values.postcode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="number"
                                            name="postcode"
                                            id="postcode"
                                            autoComplete="postal-code"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.postcode && errors.postcode && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.postcode}
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
                                            value={values.secondContactName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="secondContactName"
                                            id="secondContactName"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.secondContactName && errors.secondContactName && (
                                            <div className="block text-sm font-medium text-red-700">
                                                {errors.secondContactName}
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
                                            value={values.secondContactPhone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="secondContactPhone"
                                            id="secondContactPhone"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {touched.secondContactPhone &&
                                            errors.secondContactPhone && (
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.secondContactPhone}
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
                                onSuccess={(token) =>
                                    handleChange({
                                        target: {
                                            name: 'turnstileRes',
                                            value: token,
                                            type: 'text',
                                        },
                                    })
                                }
                            />

                            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                <button
                                    disabled={isSubmitting || !isValid}
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {isSubmitting ? 'Loading...' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <ErrorPop error={error} setError={setError} />
                </>
            )}
        </Formik>
    )
}
