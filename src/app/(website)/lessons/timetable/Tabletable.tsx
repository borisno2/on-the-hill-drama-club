import { gql } from "@ts-gql/tag/no-transform"
import { getSessionContext } from "keystone/context"

const GET_LESSON_TIMETABLE = gql`
    query GET_LESSON_TIMETABLE {
        lessons {
            id
            name
            time
            day
            location
            lessonCategory {
                id
                slug
                }
        }}
        `as import("../../../../../__generated__/ts-gql/GET_LESSON_TIMETABLE").type

export default async function Timetable() {
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
                            <button type="button" className="flex flex-col items-center pt-2 pb-3">
                                M
                            </button>
                            <button type="button" className="flex flex-col items-center pt-2 pb-3">
                                T
                            </button>
                            <button type="button" className="flex flex-col items-center pt-2 pb-3">
                                W{' '}
                            </button>
                            <button type="button" className="flex flex-col items-center pt-2 pb-3">
                                T
                            </button>
                            <button type="button" className="flex flex-col items-center pt-2 pb-3">
                                F
                            </button>
                            <button type="button" className="flex flex-col items-center pt-2 pb-3">
                                S
                            </button>
                            <button type="button" className="flex flex-col items-center pt-2 pb-3">
                                S
                            </button>
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
                                <span className="flex items-baseline">
                                    Wed{' '}
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
                                        className="relative mt-px flex sm:col-start-1" style={{ gridRow: '138 / span 27' }}>
                                        <a
                                            href={`/lessons/${lesson.lessonCategory?.slug}`}
                                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                                        >
                                            <p className="order-1 font-semibold text-blue-700">Junior Drama Club</p>
                                            <p className="text-blue-500 group-hover:text-blue-700">
                                                <time dateTime="14:30">2:30 PM</time>
                                            </p>
                                        </a>
                                    </li>
                                )) : null}
                                <li className="relative mt-px flex sm:col-start-3" style={{ gridRow: '92 / span 30' }}>
                                    <a
                                        href="#"
                                        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
                                    >
                                        <p className="order-1 font-semibold text-pink-700">Early Childood Music</p>
                                        <p className="text-pink-500 group-hover:text-pink-700">
                                            <time dateTime="2022-01-12T010:30">10:30 AM</time>
                                        </p>
                                    </a>
                                </li>
                                <li className="relative mt-px hidden sm:col-start-6 sm:flex" style={{ gridRow: '122 / span 24' }}>
                                    <a
                                        href="#"
                                        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200"
                                    >
                                        <p className="order-1 font-semibold text-gray-700">Meeting with design team at Disney</p>
                                        <p className="text-gray-500 group-hover:text-gray-700">
                                            <time dateTime="2022-01-15T10:00">10:00 AM</time>
                                        </p>
                                    </a>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
