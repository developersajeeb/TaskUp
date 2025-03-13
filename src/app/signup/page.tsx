import React from 'react';
import SignUpForm from './SignUpForm';
import { Metadata } from 'next';
import ThemeSwitch from '@/components/ThemeSwitch';
import Bg from '../../../public/images/logreg-bg.jpg';

export const metadata: Metadata = {
    title: "Sign Up - TaskUp",
};

const SignUp = () => {
    return (
        <div className="bg-gray-100 dark:bg-[#111111] p-4">
            <div className='bg-no-repeat bg-center bg-cover flex h-[calc(100vh-32px)] items-center justify-center rounded-xl' style={{ backgroundImage: `url(${Bg.src})` }}>
                <div className="login-box-shadow mx-auto w-full max-w-[570px] rounded-xl bg-white dark:bg-[#1B1B1B] p-7 md:p-10">
                    <SignUpForm />
                    <div className='flex gap-2 justify-center mt-6'>Theme Switcher: <ThemeSwitch /></div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;