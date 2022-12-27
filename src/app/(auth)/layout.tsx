import AuthContext from 'app/AuthContext';

import 'styles/tailwind.css'
import 'focus-visible'
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

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
