import AuthContext from 'app/AuthContext'

import 'styles/tailwind.css'
import 'focus-visible'
import { Footer } from 'components/Footer';

type AppProps = {
    children: React.ReactNode;
}


export default function RootLayout({ children }: AppProps) {

    return (
        <html className="h-full antialiased" lang="en">
            <body className="h-full">
                <AuthContext>
                    {children}
                    <div className='bottom-0 relative md:left-40 pl-8'><Footer /></div>
                </AuthContext>
            </body>
        </html>
    );
}
