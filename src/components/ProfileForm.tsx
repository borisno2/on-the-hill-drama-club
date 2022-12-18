"use client"
import { gql } from "@ts-gql/tag/no-transform";
import { useForm } from "lib/useForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { client } from "util/request";
import ErrorPop from "./ErrorPop";
import SuccessPop from "./SuccessPop";
type User = {
    id: string;
    firstName: string | null;
    surname?: string | null;
    email: string | null;
    phone: string | null;
    suburb: string | null;
    postcode: string | null;
    streetAddress: string | null;
};

const UPDATE_ACCOUNT = gql`
    mutation UPDATE_ACCOUNT($id: ID!, $data: AccountUpdateInput!) {
        updateAccount(where: {id: $id}, data: $data) {
            id
            phone
        }
    }
`as import("../../__generated__/ts-gql/UPDATE_ACCOUNT").type;

export default function ProfileForm({ user }: { user: User }) {
    const router = useRouter();
    const initialValues = {
        firstName: user.firstName,
        surname: user.surname,
        phone: user.phone,
        suburb: user.suburb,
        postcode: user.postcode,
        streetAddress: user.streetAddress,
    }
    const {
        inputs,
        handleChange,
    }: {
        inputs: any;
        handleChange: any;
        resetForm: any;
        handleStageButton: any;
        clearForm: any;
    } = useForm(initialValues);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.request(UPDATE_ACCOUNT, {
                id: user.id,
                data: inputs,
            });
            setSuccess(true);
            setLoading(false);
            router.refresh();
        } catch (error) {
            setError(true);
            setLoading(false);
            throw error;
        }

    }

    return (
        <form className="space-y-8 divide-y divide-gray-200" onSubmit={onsubmit}>
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">

                <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
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
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                First name
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={inputs.firstName}
                                    onChange={handleChange}
                                    title="First Name"
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    autoComplete="given-name"
                                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Last name
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    title="Last Name"
                                    onChange={handleChange}
                                    value={inputs.surname}
                                    type="text"
                                    name="surname"
                                    id="surname"
                                    autoComplete="family-name"
                                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                />
                            </div>
                        </div>


                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Phone Number
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={inputs.phone}
                                    onChange={handleChange}
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    title="phone"
                                    autoComplete="family-name"
                                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Street address
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={inputs.streetAddress}
                                    onChange={handleChange}
                                    title="Street Address"
                                    type="text"
                                    name="streetAddress"
                                    id="streetAddress"
                                    autoComplete="street-address"
                                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Suburb
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    value={inputs.suburb}
                                    onChange={handleChange}
                                    title="Suburb"
                                    type="text"
                                    name="suburb"
                                    id="suburb"
                                    autoComplete="address-level2"
                                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Post code
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <input
                                    title="Post Code"
                                    onChange={handleChange}
                                    value={inputs.postcode}
                                    type="text"
                                    name="postcode"
                                    id="postcode"
                                    autoComplete="postal-code"
                                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessPop success={success} setSuccess={setSuccess} />
            <ErrorPop error={error} setError={setError} />
            <div className="pt-5">
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {loading ? 'Loading...' : 'Save'}
                    </button>
                </div>
            </div>
        </form>
    )
}
