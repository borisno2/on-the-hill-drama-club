import { Container } from "components/Container";
import Images from "./Images";
import type { Metadata } from 'next'
import { baseMetadata } from "app/metadata";

export const metadata: Metadata = baseMetadata

export default function Home() {
    return (
        <div>
            <Container className="mt-9">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
                        Emily Calder - School of Performing Arts
                    </h1>
                </div>
            </Container>
            <Images slug='home' />
            <Container className="mt-9">
                <section>
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                        <p className="mt-4 text-lg leading-7 text-zinc-400">
                            The Arts are for everyone! At Emily Calder&apos;s School of Performing Arts, we sincerely believe that musical and theatrical education should be available to everyone young and old. Through the personalized education provided our students develop learning strategies, self-confidence, goal setting, artistic -expression and performance skills. With the educational
                            underpinning &apos;that we all learn differently&apos; Emily has developed strategies that align with the learning styles of the student. Creating an individual educational experience tailored to each student. At Emily Calder school of performing arts, we are an inclusive school and believe that students of all abilities should have the opportunity to learn.
                        </p>
                    </div>
                </section>
            </Container>
        </div>
    )
}
