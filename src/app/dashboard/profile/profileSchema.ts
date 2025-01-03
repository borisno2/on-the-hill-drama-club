import { z } from 'zod'

const updateRegex = /^(?!PLEASE_UPDATE).*$/

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'Please enter your first name' })
    .regex(updateRegex, {
      message: 'Please update your first name',
    }),
  surname: z
    .string()
    .min(1, { message: 'Please enter your surname' })
    .regex(updateRegex, {
      message: 'Please update your surname',
    }),
  phone: z
    .string()
    .length(10, { message: 'Please enter a valid 10 digit phone number' })
    .regex(/^\d+$/, {
      message: 'Please enter a valid 10 digit phone number',
    }),
  suburb: z
    .string()
    .min(1, { message: 'Please enter your Suburb' })
    .regex(updateRegex, {
      message: 'Please update your Suburb',
    }),
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
    .min(5, { message: 'Please enter your Street Address' })
    .regex(updateRegex, {
      message: 'Please update your Street Address',
    }),
  secondContactName: z.string().regex(updateRegex, {
    message: 'Please update your second contact name',
  }),
  secondContactPhone: z
    .string()
    .length(10, { message: 'Please enter a valid 10 digit phone number' })
    .regex(/^\d+$/, {
      message: 'Please enter a valid 10 digit phone number',
    }),
})

export type Values = z.input<typeof profileSchema>
