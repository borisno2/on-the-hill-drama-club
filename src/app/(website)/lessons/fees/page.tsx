import { gql } from '@ts-gql/tag/no-transform'
import { Container } from 'components/Container'
import { getSessionContext } from 'keystone/context'
import Link from 'next/link'
import { Suspense } from 'react'

const GET_LESSON_CATEFORY_FEES = gql`
    query GET_LESSON_CATEFORY_FEES {
        lessonCategories {
            id
            name
            slug
            cost
            length
        }
    }`as import("../../../../../__generated__/ts-gql/GET_LESSON_CATEFORY_FEES").type

export default async function Fees() {
    const context = await getSessionContext()
    const { lessonCategories } = await context.graphql.run({ query: GET_LESSON_CATEFORY_FEES })
    return (
        <div>
            <Container className="mt-9">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">2023 Lesson Fees</h1>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Length
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Fee per lesson
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <Suspense fallback={<tr><td>Loading...</td></tr>}>
                                                {lessonCategories ? lessonCategories.map((lesson) => (
                                                    <tr key={lesson.id}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            <Link href={`/lessons/${lesson.slug}`}> {lesson.name} </Link>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lesson.length}</td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lesson.cost}</td>
                                                    </tr>
                                                )) : <tr><td>No Lessons Found</td></tr>}
                                            </Suspense>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}
