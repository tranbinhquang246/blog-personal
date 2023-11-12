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

interface ISignUp {
  email: string;
  password: string;
  confirmPassword: string;
}

type Props = {};

const SignUp = (props: Props) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignUp>();

  const userSignUpFn = async () => {};

  const { mutate: userSignUp } = useMutation({
    mutationKey: ['postUserSignUp'],
    mutationFn: userSignUpFn,
    onSuccess: async () => {},
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => console.log(data);

  return (
    <AuthLayout>
      <div className="flex flex-col w-full gap-4 h-full justify-center items-center">
        <p className="font-bold text-3xl">Welcome to Nuntinum!</p>
        <p className="font-medium text-base">
          Sign up to become a member of nuntium.
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
          <Input
            type="password"
            className="pl-10 h-14 w-full bg-[#F8F8F8]"
            placeholder="Re-enter password"
            icon={UserIcon}
          />

          <Button type="submit">Sign Up</Button>
        </form>
        <div className="flex gap-2 text-center">
          <p className="font-light">Have an account? </p>
          <Link href="/auth/login" className="hover:underline">
            Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
