import { gql } from '@ts-gql/tag/no-transform'
import { Button } from 'components/Button'
import { Container } from 'components/Container'
import { getSessionContext } from 'keystone/context'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

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
    }`as import("../../../../../__generated__/ts-gql/GET_LESSON_CATEGORY_BY_SLUG").type
export default async function Page({ params: { slug } }: { params: { slug: string } }) {
    const context = await getSessionContext()
    const { lessonCategory } = await context.graphql.run({ query: GET_LESSON_CATEGORY_BY_SLUG, variables: { slug } })
    if (!lessonCategory) {
        redirect('/')
    }
    return (
        <Container>
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{lessonCategory.name}</h3>
            </div>
            <p className="mt-4 text-lg leading-7 text-gray-500">{lessonCategory.description}</p>
            {lessonCategory.lessons?.length !== 0 && (
                <div className="mt-6">
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Available Lessons</h3>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {lessonCategory.lessons?.map((lesson) => (
                            <li key={lesson.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        <Link className="hover:underline" href={`/dashboard/lessons/${lesson.id}`}>
                                            {lesson.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">{lesson.description}</p>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                            <dt className="text-sm leading-5 font-medium text-gray-500">Time</dt>
                                            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{lesson.time}</dd>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                            <dt className="text-sm leading-5 font-medium text-gray-500">Length</dt>
                                            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{lesson.lengthMin} minutes</dd>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                            <dt className="text-sm leading-5 font-medium text-gray-500">Day</dt>
                                            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{lesson.day}</dd>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                            <dt className="text-sm leading-5 font-medium text-gray-500">Year Level</dt>
                                            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{lesson.minYear} - {lesson.maxYear}</dd>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                            <dt className="text-sm leading-5 font-medium text-gray-500">Location</dt>
                                            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{lesson.location}</dd>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                            <dt className="text-sm leading-5 font-medium text-gray-500"></dt>
                                            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Button className="mt-6 mx-3 float-right" href="/dashboard">Enrol</Button>
                                                <Button className="mt-6 mx-3 float-right" href="/contact">Contact</Button></dd>
                                        </div>
                                    </dl>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>)}

        </Container>
    )


}