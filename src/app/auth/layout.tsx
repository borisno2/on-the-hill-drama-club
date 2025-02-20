import 'styles/tailwind.css'
import 'focus-visible'
import { Container } from 'components/Container'
import Link from 'next/link'
import { AnalyticsWrapper } from 'components/Analytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Viewport } from 'next'

type AppProps = {
  children: React.ReactNode
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: AppProps) {
  return (
    <html className="h-full antialiased" lang="en">
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-black">
        <div className="flex-grow">{children}</div>
        <footer>
          <Container.Outer>
            <div className="border-t border-zinc-100 pb-6 pt-4 dark:border-zinc-700/40">
              <Container.Inner>
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    &copy; {new Date().getFullYear()} Josh Calder. All rights
                    reserved.
                  </p>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    Website by{' '}
                    <Link href="https://www.opensaas.au">OpenSaas</Link>
                  </p>
                </div>
              </Container.Inner>
            </div>
          </Container.Outer>
        </footer>
        <SpeedInsights />
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
