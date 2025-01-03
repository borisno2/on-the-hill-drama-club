import { Container } from 'components/Container'

import Images from 'app/(home)/Images'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'
import { StaffBio } from 'components/StaffBio'
import Link from 'next/link'

export const metadata: Metadata = {
  ...getMetadata('About'),
}

export default function Page() {
  return (
    <div>
      <Images slug="about" />
      <Container className="mt-9">
        <section>
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              About On the Hill Drama Club Demonstration
            </h3>
          </div>
          <p className="mt-4 text-lg leading-7 text-gray-500">
            This site is a demonstration of a Next.js and KeystoneJS. See videos
            on JoshCalder Youtube{' '}
            <Link href="https://www.youtube.com/@joshcalder">YouTube</Link>. and
            the code on{' '}
            <Link href="https://github.com/borisno2/on-the-hill-drama-club">
              GitHub
            </Link>
          </p>
        </section>
        <StaffBio />
      </Container>
    </div>
  )
}
