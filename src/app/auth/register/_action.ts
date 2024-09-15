'use server'
import { headers } from 'next/headers'
import { keystoneContext } from 'keystone/context'
import cuid from 'cuid'
import { z } from 'zod'
//import { NextRequest, NextResponse } from 'next/server'

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || 'Turnstile'
// regex to ensure the string is not 'PLEASE_CHANGE'
const updateRegex = /^(?!PLEASE_CHANGE).*$/
const registerSchema = z
  .object({
    turnstileRes: z.string(),
    firstName: z.string().regex(updateRegex, {
      message: 'Please update your first name',
    }),
    surname: z.string().regex(updateRegex, {
      message: 'Please update your surname',
    }),
    phone: z
      .string()
      .length(10, { message: 'Please enter a valid 10 digit phone number' })
      .regex(/^\d+$/, {
        message: 'Please enter a valid 10 digit phone number',
      }),
    suburb: z.string().regex(updateRegex, {
      message: 'Please update your suburb',
    }),
    postcode: z
      .number()
      .min(1000, { message: 'Please enter a valid postcode' })
      .max(9999, { message: 'Please enter a valid postcode' }),
    streetAddress: z.string().regex(updateRegex, {
      message: 'Please update your street address',
    }),
    secondContactName: z.string(),
    secondContactPhone: z
      .string()
      .length(10, { message: 'Please enter a valid 10 digit phone number' })
      .regex(/^\d+$/, {
        message: 'Please enter a valid 10 digit phone number',
      }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
      })
    }
  })

export async function registerAccount(data: z.infer<typeof registerSchema>) {
  const validationResult = registerSchema.parse(data)
  const form = new URLSearchParams()
  form.append('secret', SECRET_KEY)
  form.append('response', validationResult.turnstileRes)
  const headersList = headers()
  form.append('remoteip', headersList.get('x-forwarded-for') as string)

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  const result = await fetch(url, {
    body: form,
    method: 'POST',
  })

  const outcome = await result.json()

  if (!outcome.success) {
    console.log('Failed to verify captcha', outcome)
    return { error: 'Verification failed' }
  }
  const existingUser = await keystoneContext.sudo().db.User.count({
    where: { email: { equals: validationResult.email } },
  })
  if (existingUser > 0) {
    return { error: 'Error creating user' }
  }
  try {
    const user = await keystoneContext.sudo().db.User.createOne({
      data: {
        email: validationResult.email,
        password: validationResult.password,
        subjectId: cuid(),
        provider: 'credentials',
        account: {
          create: {
            firstName: validationResult.firstName,
            surname: validationResult.surname,
            phone: validationResult.phone,
            suburb: validationResult.suburb,
            postcode: validationResult.postcode,
            streetAddress: validationResult.streetAddress,
            secondContactName: validationResult.secondContactName,
            secondContactPhone: validationResult.secondContactPhone,
          },
        },
      },
    })
    if (!user || !user.id || user.email !== validationResult.email) {
      return { error: 'Error Creating User' }
    }
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Error creating user' }
  }
}
