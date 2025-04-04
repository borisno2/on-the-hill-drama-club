import { Container } from 'components/Container'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Timetable, { DayOfTheWeek, GET_LESSON_TIMETABLE } from './Timetable'
import { getMetadata } from 'app/metadata'
import { getSessionContext } from 'keystone/context'

export const metadata: Metadata = {
  ...getMetadata('Timetable'),
}

export default async function TimetablePage(props: {
  searchParams: Promise<{ daySelected: string }>
}) {
  const searchParams = await props.searchParams

  const context = await getSessionContext()
  const { lessons } = await context.graphql
    .run({ query: GET_LESSON_TIMETABLE })
    .catch((error) => {
      console.error(error)
      return { lessons: [] }
    })
  let daySelected: DayOfTheWeek = 'MONDAY'
  if (searchParams.daySelected && searchParams.daySelected !== '') {
    if (
      [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ].includes(searchParams.daySelected)
    ) {
      daySelected = searchParams.daySelected as DayOfTheWeek
    } else {
      redirect('/timetable')
    }
  }
  return (
    <div>
      <Container className="mt-9">
        <section>
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              2025 Timetable
            </h3>
          </div>
          <Timetable daySelected={daySelected} lessons={lessons} />
        </section>
      </Container>
    </div>
  )
}
