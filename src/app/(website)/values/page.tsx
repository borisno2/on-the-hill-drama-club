import clsx from "clsx";
import { Container } from "components/Container";
import Image from 'next/image'

import image1 from 'images/photos/image-1.jpg'
import image2 from 'images/photos/image-2.jpg'
import image3 from 'images/photos/image-3.jpg'
import image4 from 'images/photos/image-4.jpg'
import image5 from 'images/photos/image-5.jpg'

function Photos() {
    let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

    return (
        <div className="mt-16 sm:mt-20">
            <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
                {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
                    <div
                        key={image.src}
                        className={clsx(
                            'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
                            rotations[imageIndex % rotations.length]
                        )}
                    >
                        <Image
                            src={image}
                            alt=""
                            sizes="(min-width: 640px) 18rem, 11rem"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default function Page() {
    return (
        <div>
            <Container className="mt-9">
                <section>
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Values and Ethos</h3>
                        <p className="mt-4 text-lg leading-7 text-gray-500">
                            The Arts are for everyone! At Emily Calder&apos;s School of Performing Arts, we sincerely believe that musical and theatrical education should be available to everyone young and old. Through the personalized education provided our students develop learning strategies, self-confidence, goal setting, artistic -expression and performance skills. With the educational
                            underpinning &apos;that we all learn differently&apos; Emily has developed strategies that align with the learning styles of the student. Creating an individual educational experience tailored to each student. At Emily Calder school of performing arts we are an inclusive school and believe that students of all abilities should have the opportunity to learn.
                        </p>

                    </div>
                </section>
            </Container>
        </div>
    )
}