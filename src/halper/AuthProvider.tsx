'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
    return (
        <ThemeProvider attribute="class" defaultTheme='light' >
            <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
    );
};

export default AuthProvider;