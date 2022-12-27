import RegisterForm from "components/RegisterForm"
import { SocialLogins } from "components/SocialLogins"
import { getCsrfToken } from "next-auth/react"
import Link from "next/link"

export default async function RegisterPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const csrfToken = await getCsrfToken()
    const callbackUrl = typeof searchParams?.callbackUrl === 'string' ? searchParams?.callbackUrl : "/dashboard"

    return (

        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center w-full px-4 py-8 space-y-4 bg-white border-2 border-gray-200 rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold">Register</h1>
                <p className="text-sm text-gray-500">If you already have an account <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in here</Link></p>
                <p className="text-sm text-gray-500">To setup a new account, fill in your details below and click submit</p>
                <SocialLogins callbackUrl={callbackUrl} csrfToken={csrfToken} />
                <RegisterForm callbackUrl={callbackUrl} csrfToken={csrfToken} />
            </div>
        </div>
    )
}