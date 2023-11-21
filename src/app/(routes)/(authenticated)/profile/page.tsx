'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import api from '@app/_base/api';
import Button from '@app/_components/common/Button';
import Input from '@app/_components/common/Input';
import { apiRouters } from '@app/_constants/routers';
import { LoadingContext } from '@app/_context/loading';
import { ErrorResponse } from '@app/_interfaces';
import {
  ChangePasswordForm,
  ProfileUserForm,
  User,
} from '@app/_interfaces/user';
import ImageUpload from '@app/_components/common/UploadImage';

const schemaValidateChangePassword = yup.object().shape({
  oldPassword: yup
    .string()
    .min(8, 'Password minimum 8 characters')
    .max(32, 'Password maximum 32 characters')
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

const Profile = () => {
  const { data: session } = useSession();
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<User>();
  const [avatar, setAvatar] = useState<Blob | null>(null);

  const defaultValuesProfileUser = useMemo<ProfileUserForm>(() => {
    return {
      firstName: data?.profile.firstName || '',
      lastName: data?.profile.lastName || '',
    };
  }, [data]);

  const {
    register: registerProfileForm,
    reset: resetProfileForm,
    handleSubmit: handleSubmitProfileForm,
  } = useForm<ProfileUserForm>({
    mode: 'onSubmit',
    defaultValues: defaultValuesProfileUser,
  });

  useEffect(() => {
    data && resetProfileForm(defaultValuesProfileUser);
  }, [data, resetProfileForm, defaultValuesProfileUser]);

  const {
    register: registerChangePasswordForm,
    reset: resetChangePasswordForm,
    handleSubmit: handleSubmitChangePasswordForm,
    formState: { errors: errorChangePasswordForm },
  } = useForm<ChangePasswordForm>({
    mode: 'onSubmit',
    resolver: yupResolver(schemaValidateChangePassword),
  });

  // GET PROFILE
  const userInfoFn = async () => {
    if (session?.user.id) {
      setIsLoading(true);
      return await api.get<User>(apiRouters.GET_USER(session?.user.id));
    }
  };

  const {
    data: userInfo,
    refetch: refetchUserInfo,
    isFetched: isFetchedUserInfo,
  } = useQuery({
    enabled: false,
    refetchOnMount: false,
    queryKey: ['getUserInfo'],
    queryFn: userInfoFn,
    staleTime: Infinity,
  });

  useEffect(() => {
    refetchUserInfo();
  }, []);

  useEffect(() => {
    if (isFetchedUserInfo) {
      setIsLoading(false);
    }
  }, [isFetchedUserInfo]);

  useEffect(() => {
    if (userInfo) {
      setData(userInfo.data);
    }
  }, [userInfo]);

  // UPDATE PROFILE
  const updateUserProfileFn = async (data: ProfileUserForm) => {
    if (session?.user.id) {
      setIsLoading(true);
      return await api.patch(apiRouters.CHANGE_PROFILE(session?.user.id), data);
    }
  };

  const { mutate: updateUserProfile } = useMutation({
    mutationKey: ['postUpdateUserProfile'],
    mutationFn: updateUserProfileFn,
    onSuccess: async () => {
      toast.success('Update profile successfully');
      refetchUserInfo();
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmitProfile = (value: ProfileUserForm) => {
    updateUserProfile(value);
  };

  // UPDATE PASSWORD
  const updatePasswordFn = async (data: ChangePasswordForm) => {
    if (session?.user.id) {
      setIsLoading(true);
      return await api.patch(
        apiRouters.CHANGE_PASSWORD(session?.user.id),
        data
      );
    }
  };

  const { mutate: updatePassword } = useMutation({
    mutationKey: ['postUpdatePassword'],
    mutationFn: updatePasswordFn,
    onSuccess: async () => {
      toast.success('Update password successfully');
      resetChangePasswordForm();
      refetchUserInfo();
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmitChangePassword = (value: ChangePasswordForm) => {
    updatePassword(value);
  };

  // UPDATE AVATAR
  const updateAvatarFn = async (data: { avatar: Blob }) => {
    if (session?.user.id) {
      setIsLoading(true);
      return await api.patch(
        apiRouters.CHANGE_PROFILE(session?.user.id),
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    }
  };

  const { mutate: updateAvatar } = useMutation({
    mutationKey: ['postUpdateAvatar'],
    mutationFn: updateAvatarFn,
    onSuccess: async () => {
      toast.success('Update avatar successfully');
      setAvatar(null);
      refetchUserInfo();
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onChangeAvatar = (value: Blob) => {
    setAvatar(value);
  };

  const handleChangeAvatar = () => {
    const formData = new FormData();
    if (avatar) {
      formData.append('avatar', avatar);
      updateAvatar({
        avatar: avatar,
      });
    }
  };

  return (
    <div className="w-full max-w-[1028px] px-10 py-5 xs:px-20 xs:py-10 gap-5">
      <div className="flex flex-col gap-y-5">
        <p className="text-xl font-semibold">Avatar</p>
        <div className="flex flex-col gap-3 items-end">
          <ImageUpload url={data?.profile.avatar} onChange={onChangeAvatar} />
          <Button
            type="button"
            className="w-fit px-3 py-1"
            onClick={handleChangeAvatar}>
            Save
          </Button>
        </div>

        <div className="flex flex-col gap-y-5">
          <p className="text-xl font-semibold">Change profile</p>
        </div>
        <form
          className="flex flex-col items-end gap-3"
          onSubmit={handleSubmitProfileForm(handleSubmitProfile)}>
          <Input
            className="w-full h-10 p-3"
            label="First Name"
            register={registerProfileForm('firstName')}
          />
          <Input
            className="w-full h-10 p-3"
            label="Last Name"
            register={registerProfileForm('lastName')}
          />
          <Button type="submit" className="w-fit px-3 py-1">
            Save
          </Button>
        </form>
      </div>
      <div className="flex flex-col gap-y-5">
        <p className="text-xl font-semibold">Change password</p>
        <form
          className="flex flex-col items-end gap-3"
          onSubmit={handleSubmitChangePasswordForm(handleSubmitChangePassword)}>
          <Input
            type="password"
            className="w-full h-10 p-3"
            label="Old password"
            register={registerChangePasswordForm('oldPassword')}
            error={errorChangePasswordForm.oldPassword?.message}
          />
          <Input
            type="password"
            className="w-full h-10 p-3"
            label="New password"
            register={registerChangePasswordForm('password')}
            error={errorChangePasswordForm.password?.message}
          />
          <Input
            type="password"
            className="w-full h-10 p-3"
            label="Confirm new password"
            register={registerChangePasswordForm('confirmPassword')}
            error={errorChangePasswordForm.confirmPassword?.message}
          />
          <Button className="w-fit px-3 py-1">Save</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
