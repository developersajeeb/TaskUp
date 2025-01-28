'use client';
import { FunctionComponent, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import Link from 'next/link';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import qs from 'qs';

type LoginPayload = {
  email: string;
  password: string;
};

const LoginForm: FunctionComponent = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);
  const uriParams = qs.parse(useSearchParams().toString());
  const callbackUrl = (uriParams?.callbackUrl as string) ?? '/dashboard';
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const formData = watch();

  const resetForm = () => {
    reset();
  };

  const handleLogin = async () => {
    setIsFormBtnLoading(true);
    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl,
      });

      if (!res?.error) {
        resetForm();
        toast.success("User logged in successfully!");
        router.push(res?.url || callbackUrl);
      } else {
        const error = JSON.parse(res?.error);
        Object.keys(error?.errors ?? {}).forEach((key) => {
          if (key === 'email' || key === 'password') {
            setError(key, {
              type: 'server',
              message: error?.errors[key],
            });
          }
        });
        const errMsg = error?.message ? error?.message : 'The provided credentials do not match our records.';
        setErrorMsg(errMsg);
        setIsFormBtnLoading(false);
        toast.error(errMsg);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const errMsg = 'The provided credentials do not match our records';
      setIsFormBtnLoading(false);
      toast.error(errMsg);
      setErrorMsg(errMsg);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleLogin)} className="pt-5">
        <div className="mb-5">
          <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="email">
            Email<span className='text-red-500'>*</span>
          </label>
          <InputText
            className="tu-input"
            {...register('email', {
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
        <div className="mb-4">
          <label className="mb-1 flex items-center justify-between text-sm text-gray-900 dark:text-gray-50" htmlFor="password">
            <p>Password<span className='text-red-500'>*</span></p>
            <Link href={'forgot-password'} className="text-sm text-blue-500 duration-300 hover:text-blue-700">
              Forgot Password?
            </Link>
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Password
                className="tu-password-input"
                value={formData?.password}
                onChange={onChange}
                toggleMask
                feedback={false}
              />
            )}
            rules={{
              required: {
                value: true,
                message: 'Password is required',
              },
            }}
          />

          <div>
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => <span className="w-full text-sm text-red-500">{message}</span>}
            />
          </div>
        </div>
        <p className="text-sm text-red-500">{errorMsg}</p>

        <Button
          label="Log In"
          className="primary-btn mt-3 w-full"
          disabled={isFormBtnLoading}
          loading={isFormBtnLoading}
          onClick={() => {
            clearErrors();
            setErrorMsg('');
          }}
        />
      </form>
    </>
  );
};

export default LoginForm;