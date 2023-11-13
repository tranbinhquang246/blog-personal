'use client';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import Input from '@app/_components/common/Input';
import Button from '@app/_components/common/Button';
import { LoadingContext } from '@app/_context/loading';
import { pageRouter } from '@app/_constants/routers';

import { CloseEyeIcon, EyeIcon, KeyIcon, UserIcon } from 'public/icons';

interface ILogin {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email is invalid!')
    .required('This field must not empty!'),
  password: yup.string().required('This field must not empty!'),
});

export default function Login() {
  const router = useRouter();
  const { setIsLoading } = useContext(LoadingContext);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(schema),
  });

  const userLoginFn = async (data: ILogin) => {
    setIsLoading(true);
    return await signIn('sign-in', {
      ...data,
      redirect: false,
    });
  };

  const { mutate: userLogin } = useMutation({
    mutationKey: ['postUserLogin'],
    mutationFn: userLoginFn,
    onSuccess: async (response) => {
      if (response?.ok) {
        return router.push(pageRouter.HOME);
      }
      toast.error('Login failed');
      return null;
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit: SubmitHandler<ILogin> = (data) => {
    userLogin(data);
  };

  return (
    <div className="flex flex-col w-full gap-4 h-full justify-center items-center">
      <p className="font-bold text-3xl">Welcome back!</p>
      <p className="font-medium text-base">
        Sign in to get the most out of nuntium.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 max-w-[350px] w-1/2">
        <Input
          type="email"
          className="pl-10 h-14 w-full bg-[#F8F8F8]"
          placeholder="Email"
          icon={KeyIcon}
          register={register('email')}
          error={errors.email?.message}
        />
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className="pl-10 h-14 w-full bg-[#F8F8F8]"
            placeholder="Password"
            icon={UserIcon}
            register={register('password')}
            error={errors.password?.message}
          />
          {showPassword ? (
            <button
              type="button"
              className="absolute top-1/2 right-0 -translate-y-1/2 flex justify-center items-center p-2"
              onClick={() => setShowPassword(!showPassword)}>
              <Image alt="Open eye" src={EyeIcon} width={24} height={24} />
            </button>
          ) : (
            <button
              type="button"
              className="absolute top-1/2 right-0 -translate-y-1/2 flex justify-center items-center p-2"
              onClick={() => setShowPassword(!showPassword)}>
              <Image
                alt="Close eye"
                src={CloseEyeIcon}
                width={24}
                height={24}
              />
            </button>
          )}
        </div>
        <Link
          href={''}
          className="text-sm font-light text-right hover:font-normal">
          Forgot password
        </Link>
        <Button type="submit">Login</Button>
      </form>
      <div className="flex gap-2 text-center">
        <p className="font-light">Don't have an account? </p>
        <Link href={pageRouter.SIGNUP} className="hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
