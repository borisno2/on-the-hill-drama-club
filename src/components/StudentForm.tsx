"use client"

import { gql } from "@ts-gql/tag/no-transform";
import { useForm } from "lib/useForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { client } from "util/request";
import ErrorPop from "./ErrorPop";
import SuccessPop from "./SuccessPop";
import Datepicker from "react-tailwindcss-datepicker";

type Student = {
    id: string;
    firstName: string | null;
    surname: string | null;
    dateOfBirth: string | null;
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
        dateOfBirth: student?.dateOfBirth || '',
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
            if (!student) {
                await client.request(ADD_STUDENT, {
                    data: inputs,
                });
            } else {
                await client.request(UPDATE_STUDENT, {
                    id: student.id,
                    data: inputs,
                });
            }
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
        <>
            <form className="space-y-8 divide-y divide-gray-200" onSubmit={onsubmit}>
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
                                        value={inputs.firstName}
                                        onChange={handleChange}
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
                                    Surname
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <input
                                        title="Surname"
                                        value={inputs.surname}
                                        onChange={handleChange}
                                        type="text"
                                        name="surname"
                                        id="surname"
                                        autoComplete="family-name"
                                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                    />
                                </div>
                            </div>


                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Date of Birth
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <Datepicker
                                        value={{ startDate: inputs.dateOfBirth, endDate: inputs.dateOfBirth }}
                                        onChange={dates => {
                                            if (!dates || !dates.startDate) return;

                                            handleChange({ target: { name: 'dateOfBirth', value: dates.startDate } })
                                        }}
                                        asSingle={true}
                                        useRange={false}
                                        displayFormat={"DD/MM/YYYY"}
                                        containerClassName="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                    />
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
            <ErrorPop error={error} setError={setError} />
            <SuccessPop success={success} setSuccess={setSuccess} />
        </>

    )
}
