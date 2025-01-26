import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { GET_LESSONS } from 'app/dashboard/lessons/queries'
import {
  ENROL_STUDENT_IN_LESSON,
  GET_STUDENT_BY_ID,
} from 'app/dashboard/students/queries'

import { LessonTermWhereInput } from '.keystone/types'
import { studentSchema } from 'app/dashboard/students/studentFromSchema'
import { graphql, VariablesOf } from 'gql'
import { getSessionContext } from 'keystone/context'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const CREATE_STUDENT = graphql(`
  mutation CREATE_STUDENT($data: StudentCreateInput!) {
    createStudent(data: $data) {
      id
      name
    }
  }
`)

export async function POST(req: Request) {
  const context = await getSessionContext()
  if (!context.session) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    system: `\
    - You are a student administiator at a performing arts school
    - Your role is to help students enrol in lessons
    - You can create students, get available lessons for students to enrol in, and enrol students in those lessons
    - Once you have created a student, you should get the available lessons for the student to enrol in
    - If multiple lessons are available, you should ask questions to determine which lesson is the best fit for the student
    `,
    tools: {
      createStudent: tool({
        description: 'Create a student',
        parameters: studentSchema,
        execute: async (params) => {
          console.log('Creating student', params)
          const { createStudent } = await context.graphql.run({
            query: CREATE_STUDENT,
            variables: {
              data: {
                ...params,
                account: { connect: { id: context.session!.data.accountId } },
              },
            },
          })
          if (!createStudent) {
            throw new Error('Failed to create student')
          }
          return { id: createStudent.id }
        },
      }),
      getAvailableLesson: tool({
        description: 'Get available lessons for the student to enrol in',
        parameters: z.object({
          studentId: z.string(),
        }),
        execute: async (params) => {
          console.log('Getting available lessons for student', params)
          const { student } = await context.graphql.run({
            query: GET_STUDENT_BY_ID,
            variables: { id: params.studentId },
          })
          if (!student) {
            throw new Error('Student not found')
          }
          const availableWhere = {
            AND: {
              status: { in: ['UPCOMING' as const, 'ENROL' as const] },
              lesson: {
                maxYear: { gte: student.age },
                minYear: { lte: student.age },
              },
              enrolments: {
                none: {
                  student: {
                    id: { equals: student.id },
                  },
                },
              },
            },
          } satisfies LessonTermWhereInput
          const { lessonTerms } = await context.graphql.run({
            query: GET_LESSONS,
            variables: {
              where: availableWhere as unknown as VariablesOf<
                typeof GET_LESSONS
              >['where'],
            },
          })
          return lessonTerms?.map((lessonTerm) => ({
            id: lessonTerm.id,
            name: lessonTerm.name,
            description: lessonTerm.lesson?.lessonCategory?.description,
            startDate: lessonTerm.term?.startDate,
            weekDay: lessonTerm.lesson?.day,
            startTime: lessonTerm.lesson?.time,
            cost: lessonTerm.lesson?.lessonCategory?.cost,
          }))
        },
      }),
      enrolStudentInLesson: tool({
        description: 'Enrol a student in a lesson',
        parameters: z.object({
          studentId: z.string(),
          lessonId: z.string(),
        }),
        execute: async (params) => {
          console.log('Enrolling student in lesson', params)
          const { studentId, lessonId } = params

          const { updateStudent } = await context.graphql.run({
            query: ENROL_STUDENT_IN_LESSON,
            variables: { studentId, lessonId: lessonId },
          })
          if (!updateStudent) {
            throw new Error('Failed to enrol student')
          }
          return { success: true }
        },
      }),
    },
  })
  return result.toDataStreamResponse()
}
