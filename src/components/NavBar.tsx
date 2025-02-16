'use client';
import React, { useEffect, useRef, useState } from 'react';
import ThemeSwitch from './ThemeSwitch';
import { signOut, useSession } from 'next-auth/react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/images/logo-icon.png';
import { CgMenuLeft } from 'react-icons/cg';

const NavBar = () => {
    const session = useSession();
    const op = useRef<OverlayPanel | null>(null);
    const [isLoginLoading, setIsLoggingOut] = useState<boolean>(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: '/login' });
        setIsLoggingOut(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                document.querySelector('.top-nav-wrapper')?.classList.add('border-b', 'border-gray-100', 'dark:border-none', 'shadow-[0px_-2px_13px_0px_rgba(44,44,44,0.1)]', 'dark:shadow-xl');
            } else {
                document.querySelector('.top-nav-wrapper')?.classList.remove('border-b', 'border-gray-100', 'dark:border-none', 'shadow-[0px_-2px_13px_0px_rgba(44,44,44,0.1)]', 'dark:shadow-xl');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className='fixed left-0 right-0 top-0 z-40 w-full lg:pl-[240px] bg-white dark:bg-[#121212] top-nav-wrapper'>
            <div className='container flex justify-between lg:justify-end gap-5 items-center py-4'>
                <div className='flex items-center gap-5 lg:hidden'>
                    <Link href='/'>
                        <Image src={Logo} alt='Logo' width={40} height={40} />
                    </Link>
                    <span><CgMenuLeft size={24} /></span>
                </div>
                {session.status === "authenticated" && (
                    <div className='flex gap-3 md:gap-5 items-center'>
                        <ThemeSwitch />
                        <p className='text-sm dark:text-white cursor-pointer' onClick={(e) => op.current?.toggle(e)} >
                            Hi, {session?.data?.user?.name && session?.data?.user?.name.length > 6 ? `${session?.data?.user?.name.substring(0, 6)}...` : session?.data?.user?.name}
                            <OverlayPanel className='dark:bg-[#323232]' ref={op}>
                                <Button
                                    label="Log out"
                                    className="primary-btn w-full max-w-24"
                                    disabled={isLoginLoading}
                                    loading={isLoginLoading}
                                    onClick={() => { handleLogout() }}
                                />
                            </OverlayPanel>
                        </p>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;