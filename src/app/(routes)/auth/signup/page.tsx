'use client';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import Input from '@app/_components/common/Input';
import Button from '@app/_components/common/Button';
import { LoadingContext } from '@app/_context/loading';
import api from '@app/_base/api';
import { apiRouters, pageRouter } from '@app/_constants/routers';

import { CloseEyeIcon, EyeIcon, KeyIcon, UserIcon } from 'public/icons';

interface ISignUp {
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email is invalid!')
    .required('This field must not empty!'),
  password: yup
    .string()
    .min(8, 'Password minimum 8 characters')
    .max(32, 'Password maximum 32 characters')
    .required('This field must not empty!'),
  confirmPassword: yup
    .string()
    .required('This field must not empty!')
    .oneOf([yup.ref('password')], 'Confirm password is not match!'),
});

const SignUp = () => {
  const router = useRouter();
  const { setIsLoading } = useContext(LoadingContext);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setFocus,
    setError,
    reset,
    formState: { errors },
  } = useForm<ISignUp>({
    mode: 'onBlur',
    defaultValues: { email: '', password: '', confirmPassword: '' },
    resolver: yupResolver(schema),
  });

  const userSignUpFn = async (data: ISignUp) => {
    setIsLoading(true);
    return await api.post(apiRouters.SIGNUP, data);
  };

  const { mutate: userSignUp } = useMutation({
    mutationKey: ['postUserSignUp'],
    mutationFn: userSignUpFn,
    onSuccess: async () => {
      toast.success('Sign up successfully');
      router.push(pageRouter.LOGIN);
      reset();
    },
    onError: (errors: AxiosError<{ message: string }>) => {
      setError('email', {
        type: 'manual',
        message: errors.response?.data.message,
      });
      setFocus('email');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    userSignUp(data);
  };

  return (
    <div className="flex flex-col grow w-full gap-4 h-full justify-center items-center">
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
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            className="pl-10 h-14 w-full bg-[#F8F8F8]"
            placeholder="Re-enter password"
            icon={UserIcon}
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          {showConfirmPassword ? (
            <button
              type="button"
              className="absolute top-1/2 right-0 -translate-y-1/2 flex justify-center items-center p-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Image alt="Open eye" src={EyeIcon} width={24} height={24} />
            </button>
          ) : (
            <button
              type="button"
              className="absolute top-1/2 right-0 -translate-y-1/2 flex justify-center items-center p-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Image
                alt="Close eye"
                src={CloseEyeIcon}
                width={24}
                height={24}
              />
            </button>
          )}
        </div>

        <Button type="submit" className="h-14">
          Sign Up
        </Button>
      </form>
      <div className="flex gap-2 text-center">
        <p className="font-light">Have an account? </p>
        <Link href={pageRouter.LOGIN} className="hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
