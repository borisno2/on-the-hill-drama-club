import { Container } from 'components/Container'
import Images from './Images'
import type { Metadata } from 'next'
import { baseMetadata } from 'app/metadata'
import Link from 'next/link'

export const metadata: Metadata = baseMetadata

export default function Home() {
  return (
    <div>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            On the Hill Drama Club - Demonstration site
          </h1>
        </div>
      </Container>
      <Images slug="home" />
      <Container className="mt-9">
        <section>
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <p className="mt-4 text-lg leading-7 text-zinc-400">
              This site is a demonstration of a Next.js and KeystoneJS. See
              videos on JoshCalder Youtube{' '}
              <Link href="https://www.youtube.com/@joshcalder">YouTube</Link>.
              and the code on{' '}
              <Link href="https://github.com/borisno2/on-the-hill-drama-club">
                GitHub
              </Link>
            </p>
          </div>
        </section>
      </Container>
    </div>
  )
}
