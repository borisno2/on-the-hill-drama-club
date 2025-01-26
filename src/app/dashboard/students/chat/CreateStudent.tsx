import { ResultOf } from 'gql'
import { GET_STUDENT_BY_ID } from '../queries'
import StudentForm from '../StudentForm'
import { useState } from 'react'

export function CreateStudent({
  message,
  setStudentId,
}: {
  message: string
  setStudentId: (id: string) => void
}) {
  const [student, setStudent] = useState<
    ResultOf<typeof GET_STUDENT_BY_ID>['student'] | null
  >(null)

  return (
    <>
      <p>AI: {message}</p>
      <StudentForm
        student={student}
        setStudent={(student) => {
          if (!student) {
            return
          }
          setStudent(student)
          setStudentId(student.id)
        }}
      />
    </>
  )
}
