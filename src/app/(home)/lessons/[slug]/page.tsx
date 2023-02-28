import { gql } from '@ts-gql/tag/no-transform'
import { Button } from 'components/Button'
import { Container } from 'components/Container'
import { getSessionContext } from 'keystone/context'
import labelHelper from 'lib/labelHelper'
import { redirect } from 'next/navigation'
import { Metadata } from 'next/types'
import { dayOptions } from 'types/selectOptions'
import Images from '../../Images'
import { cache } from 'react';
import { getMetadata } from 'app/metadata'

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

const getLessonCategory = cache(async (slug: string) => {
    const context = await getSessionContext()
    const { lessonCategory } = await context.graphql.run({
        query: GET_LESSON_CATEGORY_BY_SLUG,
        variables: { slug },
    })
    return lessonCategory
})

export async function generateMetadata({
    params: { slug },
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const lessonCategory = await getLessonCategory(slug);
    if (lessonCategory && lessonCategory.name) {
        return getMetadata(lessonCategory.name)
    }
    return getMetadata('Lessons')
}

export default async function Page({
    params: { slug },
}: {
    params: { slug: string }
}) {
    const lessonCategory = await getLessonCategory(slug);
    if (!lessonCategory) {
        redirect('/')
    }
    return (
        <>
            <Container>
                <div className="border-b border-zinc-200 bg-zinc-900 px-4 py-5 sm:px-6">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
                        {lessonCategory.name}
                    </h1>
                </div>
            </Container>
            <Images slug={slug} />
            <Container>
                <p className="mt-4 text-lg leading-7 text-zinc-400">
                    {lessonCategory.description}
                </p>

                {lessonCategory.lessons?.length !== 0 && (
                    <div className="mt-6">
                        <div className="border-b border-zinc-200 bg-zinc-900 px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium leading-6 text-zinc-100">
                                Available Lessons
                            </h3>
                        </div>
                        <table className="min-w-full divide-y divide-zinc-300">
                            <thead className="bg-zinc-900">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-100 sm:pl-6"
                                    >
                                        Lesson Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-100"
                                    >
                                        Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-100"
                                    >
                                        Day of the Week
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-100"
                                    >
                                        School Year Level
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-100"
                                    >
                                        Location
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-100"
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

                            <tbody className="divide-y divide-zinc-200 bg-zinc-900">
                                {lessonCategory.lessons?.map((lesson) => (
                                    <tr key={lesson.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-100 sm:pl-6">
                                            {lesson.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                                            {lesson.time}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                                            {labelHelper(dayOptions, lesson.day!)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                                            {lesson.minYear} - {lesson.maxYear}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                                            {lesson.location}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                                            {' '}
                                            {lesson.lengthMin} minutes
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            {lesson.time === 'TBD' ? (

                                                <Button className="float-right mx-3 mt-6" href="/contact">
                                                    Contact
                                                </Button>
                                            ) : (
                                                <Button className="float-right mx-3 mt-6" href="/dashboard">
                                                    Enrol
                                                </Button>)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Container>
        </>
    )
}
