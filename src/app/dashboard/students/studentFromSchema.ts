import { z } from 'zod'

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Please enter Student's first name" }),
  surname: z.string().min(1, { message: "Please enter Student's surname" }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Please enter Student's date of birth" })
    .superRefine((date, ctx) => {
      // date should be in the format of YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid date in the format YYYY-MM-DD',
        })
      }
      // Date should be in the past but no more than 110 years ago
      const minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - 110)
      const maxDate = new Date()
      const dateObj = new Date(date)
      if (dateObj > maxDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a date in the past',
        })
      }
      if (dateObj < minDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a date no more than 110 years ago',
        })
      }
    }),
  school: z.string().regex(/SCHOOL|HOME|OTHER/, {
    message: 'Please select a schooling type',
  }),
  medical: z.string().optional(),
})

export type Values = z.input<typeof studentSchema>
