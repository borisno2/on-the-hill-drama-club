import { headers } from 'next/headers'
import { keystoneContext } from 'keystone/context'
import cuid from 'cuid'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
  const form = new URLSearchParams()
  const zParse = registerSchema.safeParse(req.body)
  if (!zParse.success)
    return NextResponse.json(
      {
        error: 'Invalid data',
        errors: zParse.error.issues,
      },
      { status: 400 }
    )
  const { data } = zParse
  form.append('secret', SECRET_KEY)
  form.append('response', data.turnstileRes)
  const headersList = headers()
  form.append('remoteip', headersList.get('x-forwarded-for') as string)

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  const result = await fetch(url, {
    body: form,
    method: 'POST',
  })

  const outcome = await result.json()

  if (!outcome.success) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  }
  const existingUser = await keystoneContext.sudo().db.User.count({
    where: { email: { equals: data.email } },
  })
  if (existingUser > 0) {
    return NextResponse.json({ error: 'Error Creating User' }, { status: 400 })
  }
  try {
    const user = await keystoneContext.sudo().db.User.createOne({
      data: {
        email: data.email,
        password: data.password,
        subjectId: cuid(),
        provider: 'credentials',
        account: {
          create: {
            firstName: data.firstName,
            surname: data.surname,
            phone: data.phone,
            suburb: data.suburb,
            postcode: data.postcode,
            streetAddress: data.streetAddress,
            secondContactName: data.secondContactName,
            secondContactPhone: data.secondContactPhone,
          },
        },
      },
    })
    if (!user || !user.id || user.email !== data.email) {
      return NextResponse.json(
        { error: 'Error Creating User' },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error Creating User' }, { status: 400 })
  }
}
