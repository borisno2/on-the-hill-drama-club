import { gql } from '@ts-gql/tag/no-transform'
import { Button } from 'components/Button'
import { Container } from 'components/Container'
import { getSessionContext } from 'keystone/context'
import labelHelper from 'lib/labelHelper'
import { redirect } from 'next/navigation'
import { dayOptions } from 'types/selectOptions'

const GET_LESSON_CATEGORY_BY_SLUG = gql`
  query GET_LESSON_CATEGORY_BY_SLUG($slug: String!) {
    lessonCategory(where: { slug: $slug }) {
      id
      name
      slug
      cost
      length
      description
      lessons {
        id
        name
        description
        time
        lengthMin
        day
        minYear
        maxYear
        location
      }
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_LESSON_CATEGORY_BY_SLUG').type
export default async function Page({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const context = await getSessionContext()
  const { lessonCategory } = await context.graphql.run({
    query: GET_LESSON_CATEGORY_BY_SLUG,
    variables: { slug },
  })
  if (!lessonCategory) {
    redirect('/')
  }
  return (
    <Container>
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {lessonCategory.name}
        </h3>
      </div>
      <p className="mt-4 text-lg leading-7 text-gray-500">
        {lessonCategory.description}
      </p>
      {lessonCategory.lessons?.length !== 0 && (
        <div className="mt-6">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Available Lessons
            </h3>
          </div>
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Lesson Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Day of the Week
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  School Year Level
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Class Length
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Enrol</span>
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Enrol</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {lessonCategory.lessons?.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {lesson.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {labelHelper(dayOptions, lesson.day!)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lesson.minYear} - {lesson.maxYear}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {lesson.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {' '}
                    {lesson.lengthMin} minutes
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Button className="float-right mx-3 mt-6" href="/dashboard">
                      Enrol
                    </Button>
                    <Button className="float-right mx-3 mt-6" href="/contact">
                      Contact
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  )
}
