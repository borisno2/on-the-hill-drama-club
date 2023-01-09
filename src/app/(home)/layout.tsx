import AuthContext from 'app/AuthContext';

import { Libre_Bodoni } from '@next/font/google'
import 'styles/tailwind.css'
import 'focus-visible'
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

type AppProps = {
    children: React.ReactNode;
}

const font = Libre_Bodoni()

export default function RootLayout({
    children
}: AppProps) {
    return (
        <html lang="en">
            <body className={`bg-black`}>
                <AuthContext>
                    <div className="fixed inset-0 flex justify-center sm:px-8">
                        <div className="flex w-full max-w-7xl lg:px-8">
                            <div className="w-full ring-1 bg-zinc-900 ring-zinc-300/20" />
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
