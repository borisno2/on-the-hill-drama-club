'use client'

import { useState, useTransition } from 'react'
import { enrolStudentInLesson } from './enrolAction'

export default function EnrolButton({
  studentId,
  lessonId,
}: {
  studentId: string
  lessonId: string
}) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onClick = async () => {
    startTransition(async () => {
      const updateStudent = await enrolStudentInLesson({ studentId, lessonId })

      if (updateStudent.success) {
        setSuccess(true)
        setError(false)
      } else {
        setSuccess(false)
        setError(true)
      }
    })
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending || success || error}
      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {isPending
        ? 'Loading...'
        : success
          ? 'Enroled'
          : error
            ? 'ERROR'
            : 'Enrol'}
    </button>
  )
}
