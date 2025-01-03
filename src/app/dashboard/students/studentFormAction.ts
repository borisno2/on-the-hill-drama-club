'use server'
import { getSessionContext } from 'keystone/context'
import { studentSchema, Values } from './studentFromSchema'
import { ZodError } from 'zod'
import { redirect } from 'next/navigation'
import { graphql } from 'gql'
import { revalidatePath } from 'next/cache'

type FormState = {
  message: string
  studentId: string | null
  success: boolean
  fields?: Values
  issues?: ZodError<Values>['issues']
}

const UPDATE_STUDENT = graphql(`
  mutation UPDATE_STUDENT($studentId: ID!, $data: StudentUpdateInput!) {
    updateStudent(where: { id: $studentId }, data: $data) {
      id
      name
    }
  }
`)
const CREATE_STUDENT = graphql(`
  mutation CREATE_STUDENT($data: StudentCreateInput!) {
    createStudent(data: $data) {
      id
      name
    }
  }
`)
export async function studentFormAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const context = await getSessionContext()
  if (!context.session) {
    redirect('/auth/signin')
  }
  const formData = Object.fromEntries(data)
  const parsed = studentSchema.safeParse(formData)
  const fields = Object.fromEntries(
    Object.keys(formData).map((key) => [key, formData[key]]),
  ) as Values
  if (!parsed.success) {
    return {
      message: 'There was an issue with your submission',
      studentId: prevState.studentId,
      success: false,
      issues: parsed.error.issues,
      fields,
    }
  }
  if (prevState.studentId) {
    const { updateStudent } = await context.graphql.run({
      query: UPDATE_STUDENT,
      variables: { studentId: prevState.studentId, data: parsed.data },
    })
    if (updateStudent) {
      revalidatePath(`/dashboard/students/${updateStudent.id}`)
      return {
        message: '',
        studentId: prevState.studentId,
        success: true,
        fields,
      }
    } else {
      return {
        message: 'Error updating student',
        studentId: prevState.studentId,
        fields,
        success: false,
      }
    }
  } else {
    if (!context.session.data.accountId) {
      return {
        message: 'Error creating student',
        success: false,
        studentId: prevState.studentId,
        fields,
      }
    }
    const { createStudent } = await context.graphql.run({
      query: CREATE_STUDENT,
      variables: {
        data: {
          ...parsed.data,
          account: { connect: { id: context.session.data.accountId } },
        },
      },
    })
    if (createStudent) {
      redirect(`/dashboard/students/${createStudent.id}`)
    } else {
      return {
        message: 'Error creating student',
        success: false,
        studentId: prevState.studentId,
        fields,
      }
    }
  }
}
