import Image from 'next/image';
import { getCsrfToken } from "next-auth/react"
import SignInForm from 'components/SignInForm';
import { SocialLogins } from 'components/SocialLogins';


export default async function SignInPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
    const csrfToken = await getCsrfToken()
    const callbackUrl = searchParams.callbackUrl || "/dashboard"
    return (
        <>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Image
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                        width={100}
                        height={100}
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register for a new account
                        </a>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <SignInForm callbackUrl={callbackUrl} csrfToken={csrfToken} />
                        <SocialLogins callbackUrl={callbackUrl} csrfToken={csrfToken} />
                    </div>
                </div>
            </div>
        </>
    )
}
