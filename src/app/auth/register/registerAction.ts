'use server'
import { headers } from 'next/headers'
import { keystoneContext } from 'keystone/context'
import cuid from 'cuid'
import { type ZodError } from 'zod'
import { registerSchema, type Values } from './registerFormSchema'
import { signIn } from 'lib/auth'
//import { NextRequest, NextResponse } from 'next/server'

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || 'Turnstile'

export type FormState = {
  message: string
  fields?: Values
  issues?: ZodError<Values>['issues']
}

export async function registerAccount(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data)
  const parsed = registerSchema.safeParse(formData)
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
    console.log('Failed to verify captcha', outcome)
    return { message: 'Verification failed' }
  }
  const existingUser = await keystoneContext.sudo().db.User.count({
    where: { email: { equals: parsed.data.email } },
  })
  if (existingUser > 0) {
    return { message: 'Error creating user' }
  }
  try {
    const user = await keystoneContext.sudo().db.User.createOne({
      data: {
        email: parsed.data.email,
        password: parsed.data.password,
        subjectId: cuid(),
        provider: 'credentials',
        account: {
          create: {
            firstName: parsed.data.firstName,
            surname: parsed.data.surname,
            phone: parsed.data.phone,
            suburb: parsed.data.suburb,
            postcode: parsed.data.postcode,
            streetAddress: parsed.data.streetAddress,
            secondContactName: parsed.data.secondContactName,
            secondContactPhone: parsed.data.secondContactPhone,
          },
        },
      },
    })
    if (!user || !user.id || user.email !== parsed.data.email) {
      return { message: 'Error Creating User' }
    }
  } catch (e) {
    console.error(e)
    return { message: 'Error creating user' }
  }
  const signInFrom = new FormData()
  signInFrom.append('email', parsed.data.email)
  signInFrom.append('password', parsed.data.password)
  signInFrom.append('redirectTo', '/dashboard/students/add')
  await signIn('credentials', signInFrom)
  return { message: 'done' }
}
