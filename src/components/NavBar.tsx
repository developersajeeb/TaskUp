'use client';
import React, { useRef, useState } from 'react';
import ThemeSwitch from './ThemeSwitch';
import { signOut, useSession } from 'next-auth/react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/images/logo.png';

const NavBar = () => {
    const session = useSession();
    const op = useRef<OverlayPanel | null>(null);
    const [isLoginLoading, setIsLoggingOut] = useState<boolean>(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: '/login' });
        setIsLoggingOut(false);
    };

    return (
        <nav className='fixed left-0 right-0 top-0 z-40 w-full lg:pl-[240px] h-[80px]'>
            <div className='container flex justify-between lg:justify-end gap-5 items-center py-4'>
                <Link href='/' className='lg:hidden'>
                    <Image className={`w-[130px] md:w-[160px]`} src={Logo} alt='Logo' width={180} height={80} />
                </Link>
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