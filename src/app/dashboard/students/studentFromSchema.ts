import { z } from 'zod'

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Please enter Student's first name" }),
  surname: z.string().min(1, { message: "Please enter Student's surname" }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Please enter Student's date of birth" })
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .superRefine((date, ctx) => {
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
    })
    .describe('The student’s date of birth'),
  school: z
    .string()
    .regex(/SCHOOL|HOME|OTHER/, {
      message: 'Please select a schooling type',
    })
    .describe(
      'The type of schooling the student is receiving (e.g. School, Home Schooled, or Other)',
    ),
  medical: z.string().optional(),
})

export type Values = z.input<typeof studentSchema>
