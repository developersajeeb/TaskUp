import React, { Suspense } from 'react';
import LoginForm from './LoginForm';
import Link from 'next/link';
import { Metadata } from 'next';
import ThemeSwitch from '@/components/ThemeSwitch';
import Bg from '../../../public/images/logreg-bg.jpg';

export const metadata: Metadata = {
    title: "Login - TaskUp",
};

const Login = () => {

    return (
        <section className="bg-gray-100 dark:bg-[#111111] p-4">
            <div className='bg-no-repeat bg-center bg-cover flex h-[calc(100vh-32px)] items-center justify-center rounded-xl px-4' style={{ backgroundImage: `url(${Bg.src})` }}>
                <div className="login-box-shadow w-full max-w-[370px] rounded-xl bg-white dark:bg-[#1B1B1B]">
                    <div className="p-7 md:p-10">
                        <h3 className="mb-2.5 text-center text-lg font-semibold leading-none text-gray-900 dark:text-white">Log In</h3>
                        <Suspense>
                            <LoginForm />
                        </Suspense>
                        <p className="mt-6 text-center text-sm text-[#A6A6A6]">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-semibold text-blue-400">
                                Sign Up
                            </Link>
                        </p>
                        <div className='flex gap-2 justify-center mt-6'>Theme Switcher: <ThemeSwitch /></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;