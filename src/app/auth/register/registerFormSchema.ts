import { z } from 'zod'

export const registerSchema = z
  .object({
    turnstileRes: z.string(),
    firstName: z.string().min(1, { message: 'Please enter your first name' }),
    secondContactName: z
      .string()
      .min(1, { message: 'Please enter the name of a secondary contact' }),
    secondContactPhone: z
      .string()
      .length(10, { message: 'Please enter a valid 10 digit phone number' })
      .regex(/^\d+$/, {
        message: 'Please enter a valid 10 digit phone number',
      }),
    surname: z.string().min(1, { message: 'Please enter your surname' }),
    phone: z
      .string()
      .length(10, { message: 'Please enter a valid 10 digit phone number' })
      .regex(/^\d+$/, {
        message: 'Please enter a valid 10 digit phone number',
      }),
    suburb: z.string().min(1, { message: 'Please enter your Suburb' }),
    postcode: z
      .string()
      .length(4, 'Please enter a valid postcode')
      .transform((val, ctx) => {
        const parsed = parseInt(val)
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Postcode is not a valid number',
          })
          return z.NEVER
        }
        if (parsed < 1000 || parsed > 9999) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter a valid postcode',
          })
          return z.NEVER
        }
        return parsed
      }),
    streetAddress: z
      .string()
      .min(5, { message: 'Please enter your Street Address' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        path: ['passwordConfirmation'],
        code: 'custom',
        message: 'The passwords did not match',
      })
    }
  })

export type Values = z.input<typeof registerSchema>
