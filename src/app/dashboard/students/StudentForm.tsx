'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ErrorPop from 'components/ErrorPop'
import SuccessPop from 'components/SuccessPop'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import DropDown from 'components/DropDown'
import { GET_STUDENT_BY_ID } from 'app/dashboard/students/queries'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { ResultOf } from 'gql'
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover'
import { Button } from 'components/ui/button'
import CalendarIcon from '@heroicons/react/20/solid/CalendarIcon'
import { Calendar } from 'components/ui/calendar'
import { cn, formOnSubmit } from 'lib/utils'
import { format, isValid as dateIsValid, parse } from 'date-fns'
import { studentSchema, Values } from './studentFromSchema'
import { studentFormAction } from './studentFormAction'
import { useActionState } from 'react'

const parseDateForInput = (date: string) => {
  const parsedDate = new Date(date)
  if (dateIsValid(parsedDate)) {
    if (parsedDate.getFullYear() > new Date().getFullYear() - 1000) {
      dayjs.extend(customParseFormat)
      return dayjs(parsedDate).format('DD/MM/YYYY')
    }
  }
}

export default function Student({
  student,
  setStudent,
}: {
  student?: ResultOf<typeof GET_STUDENT_BY_ID>['student']
  setStudent?: (student: ResultOf<typeof GET_STUDENT_BY_ID>['student']) => void
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isSubmitting] = useActionState(studentFormAction, {
    message: '',
    success: false,
    studentId: student?.id || null,
  })

  const defaultValues = {
    firstName: student?.firstName || '',
    surname: student?.surname || '',
    dateOfBirth: student?.dateOfBirth || '',
    school: student?.school || 'SCHOOL',
    medical: student?.medical || '',
    ...(state?.fields ?? {}),
  }

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(defaultValues.dateOfBirth || '2020-01-01'),
  )
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(studentSchema) })

  useEffect(() => {
    if (state?.success) {
      setSuccess(true)
      reset(defaultValues)
      if (setStudent && state.studentId) {
        setStudent({
          id: state.studentId,
          firstName: state.fields?.firstName || '',
          surname: state.fields?.surname || '',
          dateOfBirth: state.fields?.dateOfBirth || '',
          school: state.fields?.school || 'SCHOOL',
          medical: state.fields?.medical || '',
          age: student?.age || 0,
        })
      } else if (!student) {
        router.push(`/dashboard/students/${state.studentId}`)
      }
    } else if (state?.message !== '') {
      setError(true)
      reset(defaultValues)
    }
  }, [state?.message, state?.success, isSubmitting])

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={formOnSubmit(handleSubmit, isValid)}
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Student Information
              </h3>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  First name
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    title="First Name"
                    {...register('firstName')}
                    type="text"
                    autoComplete="given-name"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.firstName && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.firstName.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Surname
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    title="Surname"
                    {...register('surname')}
                    type="text"
                    autoComplete="family-name"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                  {errors.surname && (
                    <div className="block text-sm font-medium text-red-700">
                      {errors.surname.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Date of Birth
                </label>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({
                    field: { onChange, value, name },
                    fieldState: { isDirty },
                  }) => (
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input type="hidden" value={value} name={name} />
                      <Popover
                        onOpenChange={(isOpen) => {
                          if (!isOpen && isDirty && student) {
                            formRef.current?.requestSubmit()
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full max-w-lg rounded-md border-gray-300 pl-3 text-left font-normal shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm',
                              !value && 'text-muted-foreground',
                            )}
                          >
                            {value ? (
                              format(new Date(value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full max-w-lg bg-white p-0 sm:max-w-xs"
                          align="start"
                        >
                          <div className="w-full p-4 pb-0">
                            <input
                              type="text"
                              placeholder="dd/mm/yyyy"
                              value={parseDateForInput(value)}
                              onChange={(event) => {
                                const value = event.target.value
                                const parsedDate = parse(
                                  value,
                                  'dd/MM/yyyy',
                                  new Date(),
                                )
                                if (dateIsValid(parsedDate)) {
                                  dayjs.extend(customParseFormat)
                                  const value =
                                    dayjs(parsedDate).format('YYYY-MM-DD')

                                  onChange(value)
                                }
                              }}
                              className="mb-2 w-72 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <Calendar
                            mode="single"
                            selected={new Date(value)}
                            onSelect={(date) => {
                              if (!date) return
                              dayjs.extend(customParseFormat)
                              onChange(dayjs(date).format('YYYY-MM-DD'))
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.dateOfBirth && (
                        <div className="block text-sm font-medium text-red-700">
                          {errors.dateOfBirth.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Age (calculated from Date of Birth)
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <p className="focus:ring-ind igo-500 sm block w-full max-w-lg rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500">
                    {student?.age
                      ? student.age.toString()
                      : 'Enter a valid date of birth and save to calculate age'}
                  </p>
                </div>
              </div>

              <Controller
                control={control}
                name="school"
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <input type="hidden" name={name} value={value} />
                    <DropDown
                      label="Education Type"
                      options={[
                        { id: 1, label: 'School', value: 'SCHOOL' },
                        { id: 2, label: 'Home Educated', value: 'HOME' },
                        { id: 3, label: 'None/Other', value: 'OTHER' },
                      ]}
                      value={value}
                      handleChange={onChange}
                      name={name}
                    />
                  </>
                )}
              />
              {errors.school && (
                <div className="block text-sm font-medium text-red-700">
                  {errors.school.message}
                </div>
              )}

              <div>
                <label
                  htmlFor="medical"
                  className="block text-sm font-medium text-gray-700"
                >
                  Any relevant medical information including action required in
                  an emergency
                </label>
                <div className="mt-1">
                  <textarea
                    rows={4}
                    title="Medical Information"
                    {...register('medical')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {errors.medical && (
                  <div className="block text-sm font-medium text-red-700">
                    {errors.medical.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {state?.issues && (
          <div className="text-red-500">
            <ul>
              {state.issues.map((issue) => (
                <li key={issue.code} className="flex gap-1">
                  {issue.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-5">
          <div className="flex justify-end">
            {student && (
              <div className="absolute right-1/3 flex px-8">
                <ArrowDownIcon height={20} />
                <p>Scroll Down for Enrollment details</p>
              </div>
            )}
            <Button
              type="button"
              onClick={() => {
                router.push('/dashboard/students')
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Loading...' : !student ? 'Add' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
      <ErrorPop error={error} setError={setError} />
      <SuccessPop success={success} setSuccess={setSuccess} />
    </>
  )
}
