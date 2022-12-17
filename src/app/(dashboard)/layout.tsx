import AuthContext from 'app/AuthContext'

import 'styles/tailwind.css'
import 'focus-visible'

type AppProps = {
    children: React.ReactNode;
}


export default function RootLayout({ children }: AppProps) {

    return (
        <html className="h-full antialiased" lang="en">
            <body className="h-full">
                <AuthContext>
                    {children}
                </AuthContext>
            </body>
        </html>
    );
}
