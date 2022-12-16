import React, { useEffect, useRef } from 'react'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'

import type { AppProps as nextProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import 'styles/tailwind.css'
import 'focus-visible'

type AppProps = {
	Component: React.ComponentType<{ previousPathname: string}>
	pageProps: Record<string, unknown>
	router: {
	  pathname: string
	}
  } & nextProps
  
  function usePrevious(value: string) {
	let ref = useRef<any>()
  
	useEffect(() => {
	  ref.current = value
	}, [value])
  
	return ref.current
  }

function MyApp({ Component, router, pageProps: { session, ...pageProps } }: AppProps) {
	let previousPathname = usePrevious(router.pathname)

	return (
		<SessionProvider session={session}>
			<div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative">
        <Header />
        <main>
          <Component previousPathname={previousPathname} {...pageProps} />
        </main>
        <Footer />
      </div>
		</SessionProvider>
	)
}

export default MyApp
