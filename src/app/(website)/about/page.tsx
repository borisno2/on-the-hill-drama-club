import { Container } from "components/Container";

import Images from "app/(home)/Images";
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('About'),
}


export default function Page() {
    return (
        <div>
            <Images slug='about' />
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