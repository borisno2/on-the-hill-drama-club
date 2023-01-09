import { gql } from "@ts-gql/tag/no-transform"
import { getSessionContext } from "keystone/context"
import Link from "next/link"

export type DayOfTheWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

const GET_LESSON_TIMETABLE = gql`
    query GET_LESSON_TIMETABLE {
        lessons {
            id
            name
            time
            day
            location
            lengthMin
            lessonCategory {
                id
                slug
                }
        }}
        `as import("../../../../../__generated__/ts-gql/GET_LESSON_TIMETABLE").type

const getColumn = (day: string | null) => {
    switch (day) {
        case 'MONDAY':
            return 'sm:col-start-1'
        case 'TUESDAY':
            return 'sm:col-start-2'
        case 'WEDNESDAY':
            return 'sm:col-start-3'
        case 'THURSDAY':
            return 'sm:col-start-4'
        case 'FRIDAY':
            return 'sm:col-start-5'
        case 'SATURDAY':
            return 'sm:col-start-6'
        case 'SUNDAY':
            return 'sm:col-start-7'
        default:
            return 'sm:col-start-0'
    }
}

function getRowStart(time: string | null, length: number | null) {
    const startTime = 9 // 9am
    const startRow = 2 // 9am
    if (!time || !length) return '0'
    const [hours, end] = time.split(':')
    // take the first two characters of minutes
    const minutes = end.slice(0, 2)
    const ap = end.slice(2)
    // if pm, add 12 to hours
    const newHours = ap === 'PM' || ap === 'pm' ? parseInt(hours) + 12 : parseInt(hours)
    // return the row start
    const rowStart = (startRow + ((newHours - startTime) * 25)) + (parseInt(minutes) * 0.4)
    return `${rowStart} / span ${length * 0.4}`

}
function DayLink({ day, daySelected }: { day: DayOfTheWeek, daySelected: DayOfTheWeek }) {
    return (
        <Link href={`/lessons/timetable?daySelected=${day}`} className={`${daySelected === day ? 'mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white' : null} flex flex-col items-center pt-2 pb-3`}>
            {day.slice(0, 1)}
        </Link>
    )
}


export default async function Timetable({ daySelected }: { daySelected: DayOfTheWeek }) {
    const context = await getSessionContext()
    const { lessons } = await context.graphql.run({ query: GET_LESSON_TIMETABLE })
    return (
        <div className="flex h-full flex-col">
            <div className="isolate flex flex-auto flex-col overflow-auto bg-white">
                <div style={{ width: '165%' }} className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
                    <div
                        className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
                    >
                        <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
                            <DayLink day='MONDAY' daySelected={daySelected} />
                            <DayLink day='TUESDAY' daySelected={daySelected} />
                            <DayLink day='WEDNESDAY' daySelected={daySelected} />
                            <DayLink day='THURSDAY' daySelected={daySelected} />
                            <DayLink day='FRIDAY' daySelected={daySelected} />
                            <DayLink day='SATURDAY' daySelected={daySelected} />
                            <DayLink day='SUNDAY' daySelected={daySelected} />
                        </div>

                        <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
                            <div className="col-end-1 w-14" />
                            <div className="flex items-center justify-center py-3">
                                <span>
                                    Mon
                                </span>
                            </div>
                            <div className="flex items-center justify-center py-3">
                                <span>
                                    Tue
                                </span>
                            </div>
                            <div className="flex items-center justify-center py-3">
                                <span>
                                    Wed
                                </span>
                            </div>
                            <div className="flex items-center justify-center py-3">
                                <span>
                                    Thu
                                </span>
                            </div>
                            <div className="flex items-center justify-center py-3">
                                <span>
                                    Fri
                                </span>
                            </div>
                            <div className="flex items-center justify-center py-3">
                                <span>
                                    Sat
                                </span>
                            </div>
                            <div className="flex items-center justify-center py-3">
                                <span>
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-auto">
                        <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
                        <div className="grid flex-auto grid-cols-1 grid-rows-1">
                            {/* Horizontal lines */}
                            <div
                                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                                style={{ gridTemplateRows: 'repeat(23, minmax(3.5rem, 1fr))' }}
                            >
                                <div className="row-end-1 h-7"></div>

                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        9AM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        10AM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        11AM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        12PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        1PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        2PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        3PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        4PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        5PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        6PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        7PM
                                    </div>
                                </div>
                                <div />
                                <div>
                                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                                        8PM
                                    </div>
                                </div>
                                <div />
                            </div>

                            {/* Vertical lines */}
                            <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                                <div className="col-start-1 row-span-full" />
                                <div className="col-start-2 row-span-full" />
                                <div className="col-start-3 row-span-full" />
                                <div className="col-start-4 row-span-full" />
                                <div className="col-start-5 row-span-full" />
                                <div className="col-start-6 row-span-full" />
                                <div className="col-start-7 row-span-full" />
                                <div className="col-start-8 row-span-full w-8" />
                            </div>

                            {/* Events */}
                            <ol
                                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                                style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
                            >
                                {lessons ? lessons.map((lesson) => (
                                    <li
                                        key={lesson.id}
                                        className={`relative mt-px ${lesson.day !== daySelected ? 'hidden sm:flex' : 'flex'} ${getColumn(lesson.day)}`} style={{ gridRow: getRowStart(lesson.time, lesson.lengthMin) }}>
                                        <a
                                            href={`/lessons/${lesson.lessonCategory?.slug}`}
                                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                                        >
                                            <p className="order-1 font-semibold text-blue-700">{lesson.name}</p>
                                            <p className="text-blue-500 group-hover:text-blue-700">
                                                <time dateTime={lesson.time ? lesson.time : undefined}>{lesson.time}</time>
                                            </p>
                                        </a>
                                    </li>
                                )) : null}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
