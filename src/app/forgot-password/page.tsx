import Link from 'next/link';
import React from 'react';
import PasswordChangeForm from './PasswordChangeForm';

const ForgotPassword = () => {
    return (
        <div
            className="flex min-h-screen items-center justify-center px-4 py-10 bg-gray-100 dark:bg-[#111111]"
        >
            <div className="login-box-shadow mx-auto w-full max-w-[370px] rounded-xl bg-white dark:bg-[#1B1B1B] p-7 md:p-10">
                <PasswordChangeForm />
                <div className="mt-6 text-center text-sm">
                    Back to <Link href={'/login'} className='text-blue-400'><b>Login</b></Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;