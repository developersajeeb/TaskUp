'use client';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const ThemeProvider = dynamic(
    () => import('next-themes').then((mod) => mod.ThemeProvider),
    {
        ssr: false,
    }
);

interface Props {
    children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {

    return (
        <ThemeProvider enableSystem={true} attribute="class" defaultTheme="dark">
            <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
    );
};

export default AuthProvider;