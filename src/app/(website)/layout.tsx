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
                    <div className="fixed inset-0 flex justify-center sm:px-8">
                        <div className="flex w-full max-w-7xl lg:px-8">
                            <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
                        </div>
                    </div>

                    <div className="relative">

                        <Header />
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
