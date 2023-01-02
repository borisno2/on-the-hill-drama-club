"use client"
import { gql } from "@ts-gql/tag/no-transform";
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { client } from "util/request";
import ErrorPop from "./ErrorPop";
import SuccessPop from "./SuccessPop";
import { z } from "zod";

type User = {
    id: string;
    firstName: string | null;
    surname: string | null;
    email: string | null;
    phone: string | null;
    suburb: string | null;
    postcode: number | null;
    streetAddress: string | null;
    secondContactName: string | null;
    secondContactPhone: string | null;
};

type Values = {
    firstName: string;
    surname: string;
    phone: string;
    suburb: string;
    postcode: number;
    streetAddress: string;
    secondContactName: string;
    secondContactPhone: string;
}

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
        firstName: user.firstName || '',
        surname: user.surname || '',
        phone: user.phone || '',
        suburb: user.suburb || '',
        postcode: user.postcode || 3550,
        streetAddress: user.streetAddress || '',
        secondContactName: user.secondContactName || '',
        secondContactPhone: user.secondContactPhone || '',
    }
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [isPending, startTransition] = useTransition();

    const onSubmit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        setSubmitting(true);
        try {
            await client.request(UPDATE_ACCOUNT, {
                id: user.id,
                data: values,
            });
            setSuccess(true);
            setSubmitting(false);
            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            setError(true);
            setSubmitting(false);
            throw error;
        }

    }
    const validate = (values: Values) => {
        const errors: Partial<Values> = {};
        // regex to ensure the string is not 'PLEASE_CHANGE'
        const updateRegex = /^(?!PLEASE_UPDATE).*$/
        const registerSchema = z.object({
            firstName: z.string().min(1, { message: "Please enter your first name" }).regex(updateRegex, {
                message: 'Please update your first name',
            }),
            surname: z.string().min(1, { message: "Please enter your surname" }).regex(updateRegex, {
                message: 'Please update your surname',
            }),
            phone: z.string().length(10, { message: "Please enter a valid 10 digit phone number" }).regex(/^\d+$/, { message: "Please enter a valid 10 digit phone number" }),
            suburb: z.string().min(1, { message: "Please enter your Suburb" }).regex(updateRegex, {
                message: 'Please update your Suburb',
            }),
            postcode: z.number().min(1000, { message: "Please enter a valid postcode" }).max(9999, { message: "Please enter a valid postcode" }),
            streetAddress: z.string().min(5, { message: "Please enter your Street Address" }).regex(updateRegex, {
                message: 'Please update your Street Address',
            }),
            secondContactName: z.string().regex(updateRegex, {
                message: 'Please update your second contact name',
            }),
            secondContactPhone: z
                .string()
                .length(10, { message: 'Please enter a valid 10 digit phone number' })
                .regex(/^\d+$/, {
                    message: 'Please enter a valid 10 digit phone number',
                }),

        })
        const result = registerSchema.safeParse(values)
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                // @ts-ignore
                errors[issue.path[0]] = issue.message;
            });
        }
        return errors;
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit}
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
                isValid
            }) => (
                <>
                    <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
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
                                                value={values.firstName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                title="First Name"
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                autoComplete="given-name"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {touched.firstName && errors.firstName &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.firstName}
                                                </div>}
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Surname
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                title="Last Name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.surname}
                                                type="text"
                                                name="surname"
                                                id="surname"
                                                autoComplete="family-name"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {touched.surname && errors.surname &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.surname}
                                                </div>}
                                        </div>
                                    </div>


                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Phone Number
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                title="phone"
                                                autoComplete="tel"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {touched.phone && errors.phone &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.phone}
                                                </div>}
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="secondContactName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Secondary Contact Name
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                value={values.secondContactName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                title="Second Contact Name"
                                                type="text"
                                                name="secondContactName"
                                                id="secondContactName"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {touched.secondContactName && errors.secondContactName &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.secondContactName}
                                                </div>}
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Secondary Contact Phone Number
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                value={values.secondContactPhone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                name="secondContactPhone"
                                                id="secondContactPhone"
                                                title="secondContactPhone"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {touched.secondContactPhone && errors.secondContactPhone &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.secondContactPhone}
                                                </div>}
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Street address
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                value={values.streetAddress}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                title="Street Address"
                                                type="text"
                                                name="streetAddress"
                                                id="streetAddress"
                                                autoComplete="street-address"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                            {touched.streetAddress && errors.streetAddress &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.streetAddress}
                                                </div>}
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Suburb
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                value={values.suburb}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                title="Suburb"
                                                type="text"
                                                name="suburb"
                                                id="suburb"
                                                autoComplete="address-level2"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {touched.suburb && errors.suburb &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.suburb}
                                                </div>}
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Postcode
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                title="Post Code"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.postcode}
                                                type="number"
                                                name="postcode"
                                                id="postcode"
                                                autoComplete="postal-code"
                                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {touched.postcode && errors.postcode &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.postcode}
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                    disabled={isSubmitting || isPending}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {isSubmitting || isPending ? 'Loading...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <SuccessPop success={success} setSuccess={setSuccess} />
                    <ErrorPop error={error} setError={setError} />
                </>)}
        </Formik>
    )
}
