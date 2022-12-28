"use client"
import { useForm } from "lib/useForm";
import { signIn } from "next-auth/react";
import { useState } from "react";
import ErrorPop from "./ErrorPop";
import SuccessPop from "./SuccessPop";

type Inputs = {
    firstName: string;
    surname: string;
    password: string;
    passwordConfirmation: string;
    email: string;
    phone: string;
    suburb: string;
    postcode: string;
    streetAddress: string;
};

export default function RegisterForm({ callbackUrl, csrfToken }: { callbackUrl: string, csrfToken?: string }) {
    const initialValues = {
        firstName: '',
        surname: '',
        phone: '',
        suburb: '',
        postcode: '',
        streetAddress: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    }
    const {
        inputs,
        handleChange,
    }: {
        inputs: Inputs;
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    } = useForm<Inputs>(initialValues);


    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement)
        const data = { turnstileRes: formData.get('cf-turnstile-response')?.toString(), ...inputs }
        if (data.password !== data.passwordConfirmation) {
            setError(true);
            setLoading(false);
            return;
        }
        if (data.password.length < 8) {
            setError(true);
            setLoading(false);
            return;
        }
        if (data.phone.length < 10) {
            setError(true);
            setLoading(false);
            return;
        }
        if (data.postcode.length < 4) {
            setError(true);
            setLoading(false);
            return;
        }
        if (data.turnstileRes === 'undefined') {
            setError(true);
            setLoading(false);
            return;
        }
        try {
            const result = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!result.ok) {
                setError(true);
                throw new Error(result.statusText);
            }
            setSuccess(true);
            setLoading(false);
            signIn('credentials', { callbackUrl })

        } catch (error) {
            setError(true);
            setLoading(false);
            throw error;
        }

    }

    return (
        <>
            <form className='space-y-6' onSubmit={onSubmit}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                            <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can recieve mail.</p>
                        </div>

                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Your First Name
                                </label>
                                <input
                                    title="Please enter your first name."
                                    value={inputs.firstName}
                                    onChange={handleChange}
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    autoComplete="given-name"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                    Your Last Name
                                </label>
                                <input
                                    title="Please enter your last name."
                                    value={inputs.surname}
                                    onChange={handleChange}
                                    type="text"
                                    name="surname"
                                    id="surname"
                                    autoComplete="family-name"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-4">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    title='Please enter a valid phone number.'
                                    value={inputs.phone}
                                    onChange={handleChange}
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    autoComplete="phone"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-4">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    title='Please enter a valid email address.'
                                    value={inputs.email}
                                    onChange={handleChange}
                                    type="text"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input

                                    value={inputs.password}
                                    onChange={handleChange}
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="new-password"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    title='Passwords must match.'
                                    value={inputs.passwordConfirmation}
                                    onChange={handleChange}
                                    type="password"
                                    name="passwordConfirmation"
                                    id="passwordConfirmation"
                                    autoComplete="new-password"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>


                            <div className="col-span-6">
                                <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                    Street address
                                </label>
                                <input
                                    title='Please enter a valid street address.'
                                    value={inputs.streetAddress}
                                    onChange={handleChange}
                                    type="text"
                                    name="streetAddress"
                                    id="streetAddress"
                                    autoComplete="street-address"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                    Suburb
                                </label>
                                <input
                                    title="Please enter a valid suburb."
                                    value={inputs.suburb}
                                    onChange={handleChange}
                                    type="text"
                                    name="suburb"
                                    id="suburb"
                                    autoComplete="address-level2"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                <label htmlFor="postalcode" className="block text-sm font-medium text-gray-700">
                                    Postcode
                                </label>
                                <input
                                    title="Please enter a valid postcode."
                                    value={inputs.postcode}
                                    onChange={handleChange}
                                    type="text"
                                    name="postcode"
                                    id="postcode"
                                    autoComplete="postal-code"
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="cf-turnstile checkbox" data-theme='light' data-sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}></div>
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {loading ? 'Loading...' : 'Next'}
                        </button>
                    </div>
                </div>
            </form>
            <SuccessPop success={success} setSuccess={setSuccess} />

            <ErrorPop error={error} setError={setError} />
        </>
    )
}