'use server'
import { headers } from 'next/headers'
import { signInSchema, Values } from './signInSchema'
import { ZodError } from 'zod'
import { signIn } from 'lib/auth'

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || 'Turnstile'

export type FormState = {
  message: string
  fields?: Values
  issues?: ZodError<Values>['issues']
}

export async function signInAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data)
  const parsed = signInSchema.safeParse(formData)
  if (!parsed.success) {
    const fields = Object.fromEntries(
      Object.keys(formData).map((key) => [key, formData[key]]),
    ) as Values
    return {
      message: 'There was an issue with your submission',
      issues: parsed.error.issues,
      fields,
    }
  }
  const form = new URLSearchParams()

  form.append('secret', SECRET_KEY)
  form.append('response', parsed.data.turnstileRes)
  const headersList = await headers()
  form.append('remoteip', headersList.get('x-forwarded-for') as string)

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  const result = await fetch(url, {
    body: form,
    method: 'POST',
  })
  const outcome = await result.json()
  if (!outcome.success) {
    return { message: 'TurnstileFailed' }
  }

  if (!outcome.success) {
    console.log('Failed to verify captcha', outcome)
    return { message: 'Verification failed' }
  }
  const signInForm = new FormData()
  signInForm.append('email', parsed.data.email)
  signInForm.append('password', parsed.data.password)
  signInForm.append('redirectTo', parsed.data.redirectTo || '/dashboard')

  await signIn('credentials', signInForm)
  return { message: 'done' }
}
