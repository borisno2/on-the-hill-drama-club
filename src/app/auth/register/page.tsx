import RegisterForm from "./RegisterForm"
import { SocialLogins } from "components/SocialLogins"
import Link from "next/link"
import Image from "next/image"
import { redirect } from 'next/navigation';
import { getSessionContext } from "keystone/context";
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Register'),
}

export default async function RegisterPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const context = await getSessionContext();
    if (context.session) {
        redirect('/dashboard')
    }
    const callbackUrl = typeof searchParams?.callbackUrl === 'string' ? searchParams?.callbackUrl : "/dashboard"
    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full px-4 py-8 space-y-4 bg-white border-2 border-gray-200 rounded-lg shadow-xl">
                <Link href="/" title='Home'>
                    <Image
                        className="mx-auto w-auto"
                        src='/emily-logo.png'
                        alt="Emily Calder - School of Performing Arts"
                        width={100}
                        height={100}
                    />
                </Link>
                <h1 className="text-2xl font-bold">Register</h1>
                <p className="text-sm text-gray-500">If you already have an account <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in here</Link></p>
                <p className="text-sm text-gray-500">To setup a new account, fill in your details below and click submit</p>
                <SocialLogins callbackUrl={callbackUrl} />
                <RegisterForm />
            </div>
        </div>
    )
}