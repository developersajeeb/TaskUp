'use client';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useRef } from 'react';
import NProgress from "nprogress";
import "nprogress/nprogress.css";

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
    const pathname = usePathname();
    const previousPathname = useRef<string | null>(null);

    useEffect(() => {
        if (previousPathname.current && previousPathname.current !== pathname) {
            NProgress.start();
        }

        const handleStop = () => {
            NProgress.done();
        };

        handleStop();
        previousPathname.current = pathname;
    }, [pathname]);

    NProgress.configure({ showSpinner: false });

    return (
        <ThemeProvider enableSystem={true} attribute="class" defaultTheme="dark">
            <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
    );
};

export default AuthProvider;