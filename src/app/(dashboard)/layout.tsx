import AuthContext from 'app/AuthContext'

import 'styles/tailwind.css'
import 'focus-visible'
import { Footer } from 'components/Footer';
import { Container } from 'components/Container';
import Link from 'next/link';

type AppProps = {
    children: React.ReactNode;
}


export default function RootLayout({ children }: AppProps) {

    return (
        <html className="h-full antialiased" lang="en">
            <body className="h-full">
                <AuthContext>
                    {children}
                    <footer className="bottom-0 md:fixed relative flex-1 py-6 flex flex-1 flex-col md:pl-64">
                        <Container.Outer>
                            <div className="border-t border-zinc-100 pt-4 pb-6 dark:border-zinc-700/40">
                                <Container.Inner>
                                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                                        <p className="text-sm text-zinc-400 dark:text-zinc-500">
                                            &copy; {new Date().getFullYear()} Josh and Emily Calder. All rights
                                            reserved.
                                        </p>
                                        <p className="text-sm text-zinc-400 dark:text-zinc-500">Website by <Link href='https://www.opensaas.au'>OpenSaas</Link></p>
                                    </div>
                                </Container.Inner>
                            </div>
                        </Container.Outer>
                    </footer>
                </AuthContext>
            </body>
        </html>
    );
}
