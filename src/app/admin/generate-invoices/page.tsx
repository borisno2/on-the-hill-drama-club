import { Container } from "components/Container";
import DropDown from "components/DropDown";
import { getSessionContext } from "keystone/context";
import TermSelection from "./TermSelection";



export default async function Page() {
    const context = await getSessionContext();
    const terms = await context.db.Term.findMany()
    const options: { id: number, label: string, value: string }[] = []
    let i = 0
    terms.map((term) => {
        options.push({ id: i, label: term.name, value: term.id })
        i++
    })
    return (
        <div>
            <Container className="mt-9">
                <section>
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Generate Invoices</h3>
                        <TermSelection options={options} />
                    </div>
                </section>
            </Container>
        </div>
    )
}