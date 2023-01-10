import { gql } from '@ts-gql/tag/no-transform'
import { getSessionContext } from 'keystone/context'
import Link from 'next/link'

export type DayOfTheWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

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
    }
  }
` as import('../../../../__generated__/ts-gql/GET_LESSON_TIMETABLE').type

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
function getColour(slug?: string | null) {
  switch (slug) {
    case 'private-music-tuition':
      return 'red'
    case 'drama-club':
      return 'blue'
    case 'only-strings-orchestra':
      return 'green'
    case 'music-theory':
      return 'purple'
    case 'musical-munchkins':
      return 'pink'
    case 'drama-teens':
      return 'teal'
    default:
      return 'gray'
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
  const newHours =
    ap === 'PM' || ap === 'pm' ? parseInt(hours) + 12 : parseInt(hours)
  // return the row start
  const rowStart =
    startRow + (newHours - startTime) * 25 + parseInt(minutes) * 0.4
  return `${rowStart} / span ${length * 0.4}`
}

function DayLink({
  day,
  daySelected,
}: {
  day: DayOfTheWeek
  daySelected: DayOfTheWeek
}) {
  const selected = 'bg-zinc-600 text-white'
  const notSelected = 'bg-zinc-100 text-zinc-600'
  return (
    <Link
      href={`/timetable?daySelected=${day}`}
      className="flex flex-col items-center pt-2 pb-2"
    >
      <span
        className={classNames(
          daySelected === day ? selected : notSelected,
          'mt-1 flex h-8 w-8 items-center justify-center rounded-full font-semibold'
        )}
      >
        {day.slice(0, 1)}
      </span>
    </Link>
  )
}

export default async function Timetable({
  daySelected,
}: {
  daySelected: DayOfTheWeek
}) {
  const context = await getSessionContext()
  const { lessons } = await context.graphql.run({ query: GET_LESSON_TIMETABLE })
  return (
    <div className="flex h-full flex-col">
      <div className="isolate flex flex-auto flex-col overflow-auto bg-white">
        <div
          style={{ width: '165%' }}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8">
            <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
              <DayLink day="MONDAY" daySelected={daySelected} />
              <DayLink day="TUESDAY" daySelected={daySelected} />
              <DayLink day="WEDNESDAY" daySelected={daySelected} />
              <DayLink day="THURSDAY" daySelected={daySelected} />
              <DayLink day="FRIDAY" daySelected={daySelected} />
              <DayLink day="SATURDAY" daySelected={daySelected} />
              <DayLink day="SUNDAY" daySelected={daySelected} />
            </div>

            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
              <div className="col-end-1 w-14" />
              <div className="flex items-center justify-center py-3">
                <span>Mon</span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>Tue</span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>Wed</span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>Thu</span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>Fri</span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>Sat</span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>Sun</span>
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
                style={{
                  gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
                }}
              >
                {lessons
                  ? lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className={classNames(
                          'relative mt-px',
                          lesson.day !== daySelected
                            ? 'hidden sm:flex'
                            : 'flex',
                          getColumn(lesson.day)
                        )}
                        style={{
                          gridRow: getRowStart(lesson.time, lesson.lengthMin),
                        }}
                      >
                        <Link
                          href={`/lessons/${lesson.lessonCategory?.slug}`}
                          className={classNames(
                            'group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5',
                            `bg-${getColour(
                              lesson.lessonCategory?.slug
                            )}-50 hover:bg-${getColour(
                              lesson.lessonCategory?.slug
                            )}-100`
                          )}
                        >
                          <p
                            className={classNames(
                              'order-1 font-semibold',
                              `text-${getColour(
                                lesson.lessonCategory?.slug
                              )}-700`
                            )}
                          >
                            {lesson.name}
                          </p>
                          <p
                            className={classNames(
                              `text-${getColour(
                                lesson.lessonCategory?.slug
                              )}-500 group-hover:text-${getColour(
                                lesson.lessonCategory?.slug
                              )}-700`
                            )}
                          >
                            <time
                              dateTime={lesson.time ? lesson.time : undefined}
                            >
                              {lesson.time}
                            </time>
                          </p>
                        </Link>
                      </li>
                    ))
                  : null}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
