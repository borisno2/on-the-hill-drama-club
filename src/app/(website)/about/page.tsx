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
                        <h3 className="text-lg font-medium leading-6 text-gray-900">About Emily Calder</h3>
                        <p className="mt-4 text-lg leading-7 text-gray-500">
                            Emily Calder started her musical education at 4 years old on the violin at the Mitchell Conservatorium of Music, in central west NSW. This humble beginning was the start of a lifelong love of the arts, with the study of violin, viola, cello, voice, piano, flute and acting.
                        </p>
                        <p className="mt-4 text-lg leading-7 text-gray-500">

                            With more than 30 years of performance experience in music and theatre, Emily developed a passion for pedagogy and education embarking on her teaching journey in 2004. In 2004 Emily achieved her Certificate of Theatre and Performance AMEB, then in 2010 Emily graduated from the University of Southern QLD with a Diploma of Music Teaching, later in 2010 Emily had the opportunity to study conducting with Jerry Nowak at the ABODA summer school.
                        </p>
                        <p className="mt-4 text-lg leading-7 text-gray-500">

                            In 2017 Emily graduated with her Bachelor of Music from the University of New England and most recently graduated with her Master&apos;s in Arts (Theatre and Performance) from the University of New England in 2022.
                        </p>
                        <p className="mt-4 text-lg leading-7 text-gray-500">

                            Emily has extensive orchestral directing, conducting and playing experience, with orchestras both armature and professional throughout NSW and Victoria. As part of her continued education Emily has studied theatre directing and over the last 7 years has had the opportunity to direct 17 theatre productions, notable Charlie and the Chocolate factory with Bendigo theatre company (2022), A Midsummer Night’s Dream with Uncertain Curtain (2021) and coming up in February 2023 Twelfth night with Uncertain Curtain.
                        </p>

                    </div>
                </section>
            </Container>
        </div>
    )
}