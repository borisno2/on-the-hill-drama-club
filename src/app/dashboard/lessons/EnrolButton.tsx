'use client'

import { ENROL_STUDENT_IN_LESSON } from 'app/dashboard/students/queries'
import { runKeystoneGraphQL } from 'keystone/context/graphql'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function EnrolButton({
  studentId,
  lessonId,
}: {
  studentId: string
  lessonId: string
}) {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onClick = async () => {
    setIsSubmitting(true)
    try {
      const studentEnrolment = await runKeystoneGraphQL({
        query: ENROL_STUDENT_IN_LESSON,
        variables: { studentId, lessonId },
      })
      startTransition(() => {
        setIsSubmitting(false)
        if (
          studentEnrolment.updateStudent &&
          studentEnrolment.updateStudent?.enrolments
        ) {
          setSuccess(true)
          setError(false)
        } else {
          setSuccess(false)
          setError(true)
        }
        router.refresh()
      })
    } catch {
      startTransition(() => {
        setIsSubmitting(false)
        setSuccess(false)
        setError(true)
      })
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSubmitting || isPending || success || error}
      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {isSubmitting || isPending
        ? 'Loading...'
        : success
        ? 'Enroled'
        : error
        ? 'ERROR'
        : 'Enrol'}
    </button>
  )
}
