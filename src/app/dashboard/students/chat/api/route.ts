import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { GET_LESSONS } from 'app/dashboard/lessons/queries'
import {
  ENROL_STUDENT_IN_LESSON,
  GET_STUDENT_BY_ID,
  GET_STUDENTS,
} from 'app/dashboard/students/queries'
import { getSessionContext } from 'keystone/context'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const context = await getSessionContext()
  if (!context.session) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `\
    - You are a student administrator at a performing arts school
    - Your role is to help students enrol in lessons
    - You need to first check to see if the user has students in their account
    - If the user has no students, you provide the form to create a student
    - If the user has students, give them the option to select a student or create a new student
    - If the user has multiple students, ask questions to determine which student they are referring to
    - You can get available lessons for students to enrol in
    - If multiple lessons are available, give them the available days and what might be different about each day
    and then ask questions to determine which lesson is the best fit for the student
    - consider the student's age, most suitable time and day the particular features of the lesson available in the description
    - Once the student has selected a lesson, enrol them in the lesson
    - If the user has other students, ask if they would like to enrol another student
    `,
    tools: {
      createStudent: tool({
        description: 'Let the user create a student using the form provided',
        parameters: z.object({
          message: z
            .string()
            .describe('A message asking the user to create a student'),
        }),
      }),
      getStudents: tool({
        description: 'Get students that the user has in their account',
        parameters: z.object({}),
        execute: async () => {
          console.log('Getting students')
          const { students } = await context.graphql.run({
            query: GET_STUDENTS,
          })
          return students?.map((student) => ({
            studentId: student.id,
            firstName: student.firstName,
            age: student.age,
          }))
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
            AND: [
              {
                status: { in: ['UPCOMING', 'ENROL'] },
              },
              {
                lesson: {
                  maxYear: { gte: student.age },
                  minYear: { lte: student.age },
                },
              },
              {
                enrolments: {
                  none: {
                    student: {
                      id: { equals: student.id },
                    },
                  },
                },
              },
            ],
          }
          const { lessonTerms } = await context.graphql.run({
            query: GET_LESSONS,
            variables: {
              where: availableWhere,
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
