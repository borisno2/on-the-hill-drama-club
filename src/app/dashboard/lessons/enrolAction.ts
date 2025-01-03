'use server'
import { ENROL_STUDENT_IN_LESSON } from 'app/dashboard/students/queries'
import { getSessionContext } from 'keystone/context'
import { revalidatePath } from 'next/cache'

export async function enrolStudentInLesson({
  studentId,
  lessonId,
}: {
  studentId: string
  lessonId: string
}) {
  const context = await getSessionContext()
  const { updateStudent } = await context.graphql.run({
    query: ENROL_STUDENT_IN_LESSON,
    variables: { studentId, lessonId },
  })
  revalidatePath(`/dashboard/students/${studentId}`)
  if (!updateStudent) {
    return { success: false }
  }
  return { success: true }
}
