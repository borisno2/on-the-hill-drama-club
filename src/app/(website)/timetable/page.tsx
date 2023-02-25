import { Container } from 'components/Container'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Timetable, { DayOfTheWeek } from './Tabletable'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Timetable'),
}

export default function TimetablePage({ searchParams }: { searchParams: { daySelected: string } }) {
    let daySelected: DayOfTheWeek = 'MONDAY'
    if (searchParams.daySelected && searchParams.daySelected !== '') {
        if (['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(searchParams.daySelected)) {
            daySelected = searchParams.daySelected as DayOfTheWeek
        }
        else {
            redirect('/timetable')
        }
    }
    return (
        <div>
            <Container className="mt-9">
                <section>
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">2023 Timetable</h3>
                    </div>
                    {/* @ts-expect-error: Server Component */}
                    <Timetable daySelected={daySelected} />
                </section>
            </Container>
        </div>
    )
}
