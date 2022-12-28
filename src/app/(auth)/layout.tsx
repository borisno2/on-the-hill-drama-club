import AuthContext from 'app/AuthContext';

import 'styles/tailwind.css'
import 'focus-visible'
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import Script from 'next/script'

type AppProps = {
  children: React.ReactNode;
}


export default function RootLayout({
  children
}: AppProps) {
  return (
    <html className="h-full antialiased" lang="en">
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-black">
        <AuthContext>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async={true}
            defer={true}></Script>
          <div className="relative">
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
