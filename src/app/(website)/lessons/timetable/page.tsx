import { Container } from 'components/Container'
import Timetable from './Tabletable'

export default function Home() {
    return (
        <div>
            <Container className="mt-9">
                <section>
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">2023 Timetable</h3>
                    </div>
                    <Timetable />
                </section>
            </Container>
        </div>
    )
}
