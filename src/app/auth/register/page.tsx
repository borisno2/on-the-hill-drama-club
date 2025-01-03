import RegisterForm from './RegisterForm'
import { SocialLogins } from 'components/SocialLogins'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getSessionContext } from 'keystone/context'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
  ...getMetadata('Register'),
}

export default async function RegisterPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const context = await getSessionContext()
  if (context.session) {
    redirect('/dashboard')
  }
  const callbackUrl =
    typeof searchParams?.callbackUrl === 'string'
      ? searchParams?.callbackUrl
      : '/dashboard'
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center space-y-4 rounded-lg border-2 border-gray-200 bg-white px-4 py-8 shadow-xl">
        <Link href="/" title="Home">
          <Image
            className="mx-auto w-auto"
            src="/oth-logo.png"
            alt="On the Hill Drama Club"
            width={100}
            height={100}
          />
        </Link>
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-sm text-gray-500">
          If you already have an account{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          To setup a new account, fill in your details below and click submit -
          Note: this is a demonstration site only
        </p>
        <SocialLogins callbackUrl={callbackUrl} />
        <RegisterForm />
      </div>
    </div>
  )
}
