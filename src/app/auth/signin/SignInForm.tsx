'use client'
import { useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { signInAction } from './signInAction'
import { signInSchema, Values } from './signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useActionState } from 'react'
import { formOnSubmit } from 'lib/utils'

export default function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  const [error, setError] = useState('')
  const [state, formAction, isSubmitting] = useActionState(signInAction, {
    message: '',
  })
  const defaultValues = {
    email: '',
    password: '',
    turnstileRes: '',
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(signInSchema) })

  useEffect(() => {
    if (typeof state?.message === 'string' && state?.message !== '') {
      setError(state.message)
    }
  }, [state?.message])
  return (
    <form
      action={formAction}
      className="space-y-6"
      onSubmit={formOnSubmit(handleSubmit, isValid)}
      ref={formRef}
    >
      <input name="redirectTo" type="hidden" defaultValue={callbackUrl} />
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            title="Please enter a valid email address."
            {...register('email')}
            autoComplete="email"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <div className="block text-sm font-medium text-red-700">
              {errors.email.message}
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />

          {errors.password && (
            <div className="block text-sm font-medium text-red-700">
              {errors.password.message}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <Turnstile
        className="flex justify-center"
        options={{ theme: 'light', responseFieldName: 'turnstileRes' }}
        siteKey={
          process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
          '1x00000000000000000000AA'
        }
        onSuccess={(token: string) => setValue('turnstileRes', token)}
      />

      {errors.turnstileRes && (
        <div className="block text-sm font-medium text-red-700">
          {errors.turnstileRes.message}
        </div>
      )}
      {state?.issues && (
        <div className="text-red-500">
          <ul>
            {state.issues.map((issue) => (
              <li key={issue.code} className="flex gap-1">
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Loading...' : 'Sign in'}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </form>
  )
}
