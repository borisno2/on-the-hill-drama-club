"use client";

import React from 'react'
import { SessionProvider } from 'next-auth/react'

import 'styles/tailwind.css'
import 'focus-visible'

type AppProps = {
    children: React.ReactNode;
}


export default function AuthContext({
    children
}: AppProps) {

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
