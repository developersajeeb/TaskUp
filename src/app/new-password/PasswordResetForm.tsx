'use client';
import { ErrorMessage } from '@hookform/error-message';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type ResetPasswordPayload = {
    password: string;
    password_confirmation: string;
};

const PasswordResetForm: FunctionComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFormBtnLoading, setIsFormBtnLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordPayload>({
        defaultValues: {
            password: '',
        },
    });

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const onSubmit = async (data: { password: string }) => {
        setIsFormBtnLoading(true);
        try {
            if (!token) {
                throw new Error("Token is missing or invalid");
            }
    
            const response = await fetch("/api/auth/new-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: data.password, token }), // Ensure token is passed
            });
    
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Something went wrong");
    
            toast.success("Password changed successfully!");
            router.push("/login");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to reset password");
        } finally {
            setIsFormBtnLoading(false);
        }
    };    

    return (
        <>
            <h1 className="mb-5 text-center text-lg font-semibold text-gray-900 dark:text-white">
                New Password
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Password Field */}
                <div className='mb-4'>
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
                                        <ul className="ml-2 mt-0 pl-2">
                                            <li>Minimum 6 characters</li>
                                            <li>Maximum 60 characters</li>
                                        </ul>
                                    </div>
                                )}
                            />
                        )}
                        rules={{
                            required: { value: true, message: 'Password is required' },
                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            maxLength: { value: 60, message: 'Password should be max 60 characters' },
                        }}
                    />
                    <ErrorMessage errors={errors} name="password" render={({ message }) => <span className="text-sm text-red-500">{message}</span>} />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="mb-2 text-sm text-gray-600 dark:text-gray-50" htmlFor="confirm_password">
                        Confirm Password<span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="password_confirmation"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Password className="tu-password-input" value={value} onChange={onChange} toggleMask feedback={false} />
                        )}
                        rules={{
                            required: { value: true, message: 'Confirm password is required' },
                            minLength: { value: 6, message: 'Confirm password must be at least 6 characters' },
                            maxLength: { value: 60, message: 'Confirm password should be max 60 characters' },
                            validate: (value, formValues) => (value === formValues.password ? true : 'Passwords do not match'),
                        }}
                    />
                    <ErrorMessage errors={errors} name="password_confirmation" render={({ message }) => <span className="text-sm text-red-500">{message}</span>} />
                </div>

                {/* Submit Button */}
                <Button type="submit" label="Submit" className="primary-btn w-full mt-6" disabled={isFormBtnLoading} loading={isFormBtnLoading} />
            </form>
        </>
    );
};

export default PasswordResetForm;
