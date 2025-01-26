import React from 'react';
import LoginForm from './LoginForm';

const Login = () => {

    return (
        <div
            className="flex h-screen items-center justify-center bg-gray-100 dark:bg-[#111111] px-4">
            <div className="login-box-shadow w-full max-w-[370px] rounded-xl bg-white dark:bg-[#1B1B1B]">
                <div className="p-7 md:p-10">
                    <h3 className="mb-2.5 text-center text-lg font-semibold leading-none text-gray-900 dark:text-white">Log In</h3>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default Login;