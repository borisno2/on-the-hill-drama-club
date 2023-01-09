import { gql } from "@ts-gql/tag/no-transform";
import { Container } from "components/Container";
import { getSessionContext } from "keystone/context";
import { redirect } from "next/navigation";

const GET_IMPORTANT_DATES = gql`
    query GET_IMPORTANT_DATES {
        importantDates {
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
    const { importantDates } = await context.graphql.run({
        query: GET_IMPORTANT_DATES,
    })
    if (!importantDates) {
        redirect('/')
    }

    return (
        <div>
            <Container className="mt-9">
                <section>
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Important Dates</h1>
                        {importantDates.length !== 0 && (importantDates.map((date) => {
                            return (
                                <div className="mt-4" key={date.id}>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{date.name}</h3>
                                    <p className="mt-2 text-base leading-6 text-gray-500">{date.brief}</p>
                                </div>
                            )
                        })
                        )}
                    </div>
                </section>
            </Container>
        </div>
    )
}