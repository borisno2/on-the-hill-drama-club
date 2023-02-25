import { gql } from "@ts-gql/tag/no-transform";
import { Container } from "components/Container";
import { getSessionContext } from "keystone/context";
import { formatDate } from "lib/formatDate";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Important Dates'),
}

const GET_IMPORTANT_DATES = gql`
    query GET_IMPORTANT_DATES($filterDay: CalendarDay!) {
        importantDates(where: {date: {gte: $filterDay} }, orderBy: { date: asc }) {
            id
            name
            date
            brief
            description
        }
    }

`as import("../../../../__generated__/ts-gql/GET_IMPORTANT_DATES").type

export default async function Page() {
    const context = await getSessionContext()
    // Filter by three days in the past
    const filterDay = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
    const { importantDates } = await context.graphql.run({
        query: GET_IMPORTANT_DATES,
        variables: { filterDay }
    })
    if (!importantDates) {
        redirect('/')
    }

    return (
        <div>
            <Container className="mt-9">
                <section>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Important Dates</h1>
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {importantDates.length !== 0 && (importantDates.map((date) => {
                            return (
                                <li key={date.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                                    <div className="flex w-full items-center justify-between space-x-6 p-6">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-sm font-medium text-gray-900">{date.name}</h3>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{formatDate(date.date)}</p>
                                            <p className="mt-1 text-sm text-gray-500">{date.brief}</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                        )}
                    </ul>
                </section>
            </Container>
        </div>
    )
}