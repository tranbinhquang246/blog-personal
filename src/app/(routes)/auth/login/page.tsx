'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import AuthLayout from '../layout';
import Input from '@app/_components/common/Input';
import { KeyIcon, UserIcon } from 'public/icons';
import Link from 'next/link';
import Button from '@app/_components/common/Button';

interface ILogin {
  email: string;
  password: string;
}

type Props = {};

export default function Login({}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ILogin>();

  const userLoginFn = async () => {
    return await signIn('sign-in', {
      email: email,
      password: password,
      redirect: false,
    });
  };

  const { mutate: userLogin } = useMutation({
    mutationKey: ['postUserLogin'],
    mutationFn: userLoginFn,
    onSuccess: async (response) => {
      if (response?.ok) {
        return router.push('/');
      }
      return null;
    },
  });

  const onSubmit: SubmitHandler<ILogin> = (data) => console.log(data);

  return (
    <AuthLayout>
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
          />
          <Input
            type="password"
            className="pl-10 h-14 w-full bg-[#F8F8F8]"
            placeholder="Password"
            icon={UserIcon}
          />
          <Link
            href={''}
            className="text-sm font-light text-right hover:font-normal">
            Forgot password
          </Link>
          <Button type="submit">Login</Button>
        </form>
        <div className="flex gap-2 text-center">
          <p className="font-light">Don't have an account? </p>
          <Link href={''} className="hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
