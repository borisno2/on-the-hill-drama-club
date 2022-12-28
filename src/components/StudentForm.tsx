"use client"

import { gql } from "@ts-gql/tag/no-transform";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { client } from "util/request";
import ErrorPop from "./ErrorPop";
import SuccessPop from "./SuccessPop";
import Datepicker from "react-tailwindcss-datepicker";
import { Formik, FormikHelpers } from "formik";
import { z } from "zod";

type Student = {
    id: string;
    firstName: string | null;
    surname: string | null;
    dateOfBirth: string | null;
};

type Values = {
    firstName: string;
    surname: string;
    dateOfBirth: string;
};

const UPDATE_STUDENT = gql`
    mutation UPDATE_STUDENT($id: ID!, $data: StudentUpdateInput!) {
        updateStudent(where: {id: $id}, data: $data) {
            id
            firstName
            surname
            dateOfBirth
        }
    }
`as import("../../__generated__/ts-gql/UPDATE_STUDENT").type

const ADD_STUDENT = gql`
    mutation ADD_STUDENT($data: StudentCreateInput!) {
        createStudent(data: $data) {
            id
            firstName
            surname
            dateOfBirth
        }
    }
    `as import("../../__generated__/ts-gql/ADD_STUDENT").type

export default function Student({ student }: { student?: Student }) {
    const router = useRouter();
    const initialValues = {
        firstName: student?.firstName || '',
        surname: student?.surname || '',
        dateOfBirth: student?.dateOfBirth || (new Date().toISOString()),
    }
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const onSubmit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        setSubmitting(true);
        try {
            if (!student) {
                await client.request(ADD_STUDENT, {
                    data: values,
                });

                setSuccess(true);
                setSubmitting(false);
                router.push('/dashboard/students');
            } else {
                await client.request(UPDATE_STUDENT, {
                    id: student.id,
                    data: values,
                });

                setSuccess(true);
                setSubmitting(false);
                router.refresh();
            }
        } catch (error) {
            setError(true);
            setSubmitting(false);
            throw error;
        }

    }
    const validate = (values: Values) => {
        const errors: Partial<Values> = {};
        const registerSchema = z.object({
            firstName: z.string().min(1, { message: "Please enter Student's first name" }),
            surname: z.string().min(1, { message: "Please enter Student's surname" }),
            dateOfBirth: z.string().min(1, { message: "Please enter Student's date of birth" })
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
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Student Information</h3>
                                </div>
                                <div className="space-y-6 sm:space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            First name
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <input
                                                title="First Name"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                                title="Surname"
                                                value={values.surname}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Date of Birth
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <Datepicker
                                                value={{ startDate: values.dateOfBirth, endDate: values.dateOfBirth }}
                                                onChange={dates => {
                                                    if (!dates || !dates.startDate) return;

                                                    handleChange({ target: { name: 'dateOfBirth', value: dates.startDate } })
                                                }}
                                                asSingle={true}
                                                useRange={false}
                                                displayFormat={"DD/MM/YYYY"}
                                                containerClassName="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                            />
                                            {errors.dateOfBirth &&
                                                <div className="block text-sm font-medium text-red-700">
                                                    {errors.dateOfBirth}
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ErrorPop error={error} setError={setError} />

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => { router.push('/dashboard/students') }}
                                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {isSubmitting ? 'Loading...' : !student ? 'Add' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </form>
                    <ErrorPop error={error} setError={setError} />
                    <SuccessPop success={success} setSuccess={setSuccess} />
                </>)}
        </Formik>

    )
}
