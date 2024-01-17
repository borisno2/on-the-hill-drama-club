'use client'
import Link from 'next/link'

import { Container } from 'components/Container'

export function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Josh and Emily Calder. All
                rights reserved.
              </p>
              <Link
                className="text-sm text-zinc-400 dark:text-zinc-500"
                href="/contact"
              >
                Contact and Location
              </Link>

              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Website by <Link href="https://www.opensaas.au">OpenSaas</Link>
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
