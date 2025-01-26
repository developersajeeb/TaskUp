import React from 'react';
import SignUpForm from './SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sign Up - Personal Project Management",
  };

const SignUp = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-[#111111] px-4">
            <div className="login-box-shadow mx-auto w-full max-w-[570px] rounded-xl bg-white dark:bg-[#1B1B1B] p-7 md:p-10">
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUp;