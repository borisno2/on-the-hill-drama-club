import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function teacherNameHelper(
  teachers?: readonly { readonly name: string | null }[] | null,
) {
  if (!teachers || !teachers.length) return 'TBD'
  if (teachers.length === 1) return teachers[0].name
  const teacherNames = teachers.map((teacher) => teacher.name)
  teacherNames[teacherNames.length - 1] = `and ${
    teacherNames[teacherNames.length - 1]
  }`
  return teacherNames.join(', ')
}
