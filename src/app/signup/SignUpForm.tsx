'use client';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import React, { useTransition } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type RegistrationPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

const SignUpForm = () => {
    const router = useRouter();
    const [isFormBtnLoading, startTransition] = useTransition();

    const {
        register,
        control,
        handleSubmit,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm<RegistrationPayload>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
    });

    const formData = watch();

    const handleFormSubmit = async (data: RegistrationPayload) => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            if (response.ok) {
                toast.success("Registration successful!");
                router.push('/dashboard');
            } else {
                toast.error(result.message || "Registration failed");
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message || "Something went wrong!");
        }
    };

    
    

    return (
        <>
            <h1 className="mb-2.5 text-center text-lg font-semibold leading-none text-gray-900 dark:text-white">Sign In</h1>
            <form className="mt-7">
                <div className="mb-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 text-sm text-gray-600 dark:text-gray-50">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <InputText
                            className="tu-input"
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: 'Name is required',
                                },
                            })}
                        />
                        <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                        />
                    </div>

                    <div>
                        <label className="mb-1 text-sm text-gray-600 dark:text-gray-50">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <InputText
                            className="tu-input"
                            value={formData.email}
                            {...register('email', {
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                    message: 'Please provide a valid email',
                                },
                                required: {
                                    value: true,
                                    message: 'Email is required',
                                },
                            })}
                        />
                        <ErrorMessage
                            errors={errors}
                            name="email"
                            render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                        />
                    </div>
                </div>


                <div className="mb-3 mt-4 grid gap-4">
                    <div>
                        <label className="mb-1 text-sm text-gray-600 dark:text-gray-50" htmlFor="set_password">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Password
                                    className="tu-password-input"
                                    value={value}
                                    onChange={onChange}
                                    toggleMask
                                    footer={() => (
                                        <div className="mt-5 border-t border-gray-300">
                                            <p className="mt-2">Suggestions:</p>
                                            <ul className="line-height-3 ml-2 mt-0 pl-2">
                                                <li>Minimum 6 characters</li>
                                                <li>Maximum 60 characters</li>
                                            </ul>
                                        </div>
                                    )}
                                />
                            )}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Password is required',
                                },
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 8 characters',
                                },
                                maxLength: {
                                    value: 60,
                                    message: 'Password should be max 60 characters',
                                },
                            }}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="password"
                            render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                        />
                    </div>

                    <div>
                        <label className="mb-1 text-sm text-gray-600 dark:text-gray-50" htmlFor="confirm_password">
                            Confirm Password<span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="password_confirmation"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Password
                                    className="tu-password-input"
                                    value={value}
                                    onChange={onChange}
                                    toggleMask
                                    feedback={false}
                                />
                            )}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Confirm password is required',
                                },
                                minLength: {
                                    value: 6,
                                    message: 'Confirm password must be at least 6 characters',
                                },
                                maxLength: {
                                    value: 60,
                                    message: 'Confirm password should be max 60 characters',
                                },
                                validate: {
                                    identityPattern: (value, formValues) => {
                                        if (formValues?.password === value) {
                                            return true;
                                        } else {
                                            return `Password is not matched`;
                                        }
                                    },
                                },
                            }}
                        />

                        <div className="flex justify-between">
                            <ErrorMessage
                                errors={errors}
                                name="password_confirmation"
                                render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Button
                        className="primary-btn max-w-32 w-full"
                        label="Register"
                        disabled={isFormBtnLoading}
                        loading={isFormBtnLoading}
                        onClick={() => {
                            clearErrors();
                            startTransition(() => handleSubmit(handleFormSubmit)());
                        }}
                    ></Button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-[#A6A6A6]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-blue-400">
                    Login
                </Link>
            </p>
        </>
    );
};

export default SignUpForm;