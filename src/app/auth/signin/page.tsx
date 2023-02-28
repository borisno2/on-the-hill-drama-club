import Image from 'next/image';
import SignInForm from './SignInForm';
import { SocialLogins } from 'components/SocialLogins';
import Link from 'next/link';
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Sign In'),
}

export default async function SignInPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const callbackUrl = typeof searchParams?.callbackUrl === 'string' ? searchParams?.callbackUrl : "/dashboard"
    return (
        <>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link href="/" title='Home'>
                        <Image
                            className="mx-auto w-auto"
                            src='/emily-logo.png'
                            alt="Emily Calder - School of Performing Arts"
                            width={100}
                            height={100}
                        />
                    </Link>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register for a new account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <SignInForm callbackUrl={callbackUrl} />
                        <SocialLogins callbackUrl={callbackUrl} />
                    </div>
                </div>
            </div>
        </>
    )
}
