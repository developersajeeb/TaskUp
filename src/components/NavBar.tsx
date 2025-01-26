'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import Logo from '../../public/images/logo.png';
import ThemeSwitch from './ThemeSwitch';
import { signOut, useSession } from 'next-auth/react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

const NavBar = () => {
    const session = useSession();
    const op = useRef<OverlayPanel | null>(null);
    const [isLoginLoading, setIsLoggingOut] = useState<boolean>(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: '/' });
        setIsLoggingOut(false);
    };

    return (
        <nav className='bg-gray-50 dark:bg-[#1b1b1b]'>
            <div className="max-w-[1320px] flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href='/'>
                    <Image className='w-[130px] md:w-[160px]' src={Logo} alt='Coffee Place' width={180} height={80} />
                </Link>

                <div className='flex gap-3 md:gap-5 items-center'>
                    <ThemeSwitch />
                    {session.status === "authenticated" ? (
                        <p className='text-sm dark:text-white cursor-pointer' onClick={(e) => op.current?.toggle(e)} >
                            Hi, {session?.data?.user?.name && session?.data?.user?.name.length > 6 ? `${session?.data?.user?.name.substring(0, 6)}...` : session?.data?.user?.name}
                            <OverlayPanel className='dark:bg-[#323232]' ref={op}>
                                <Button
                                    label="Log out"
                                    className="primary-btn w-full max-w-24"
                                    disabled={isLoginLoading}
                                    loading={isLoginLoading}
                                    onClick={() => {handleLogout()}}
                                />
                            </OverlayPanel>
                        </p>
                    ) : (
                        <>
                            <Link href="/login" className="relative inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 overflow-hidden font-mono font-medium tracking-tighter text-white bg-[#7F6BCA] rounded-md group hover:text-gray-600 duration-300">
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#F9E7A0] rounded-full group-hover:w-56 group-hover:h-56"></span>
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent "></span>
                                <span className="relative text-sm">Log In</span>
                            </Link>
                            <Link href='/signup' className="relative inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 overflow-hidden font-mono font-medium tracking-tighter text-[#7F6BCA] border border-[#7F6BCA] hover:border-[#F9E7A0] rounded-md group hover:text-gray-600 duration-300">
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#F9E7A0] rounded-full group-hover:w-56 group-hover:h-56"></span>
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent "></span>
                                <span className="relative text-sm">Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;