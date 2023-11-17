'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Input from '@app/_components/common/Input';
import { SubmitHandler } from 'react-hook-form';

import Button from '@app/_components/common/Button';
import CreatePostModal from '@app/_components/modals/CreatePostModal';
import { CreationData, PostForm } from '@app/_interfaces/post';
import api from '@app/_base/api';
import { apiRouters } from '@app/_constants/routers';
import { SearchIcon } from 'public/icons';

const Posts = () => {
  const [openModalCreatePost, setOpenModalCreatePost] = useState(false);

  // GET CREATION DATA
  const getCreationData = async () => {
    return await api.get<CreationData>(apiRouters.CREATION_POST_DATA);
  };

  const { data: listCreationData } = useQuery({
    enabled: true,
    refetchOnMount: true,
    queryKey: ['getCreationData'],
    queryFn: getCreationData,
    staleTime: Infinity,
  });

  const onSubmitCreatePost: SubmitHandler<PostForm> = (values) => {
    console.log(values);
  };
  return (
    <div className="flex flex-col gap-5 w-full h-full p-10 text-sm">
      <div className="flex justify-between w-full">
        <p className="font-bold text-xl">Post management</p>
        <Button
          className="w-[148px] h-10"
          onClick={() => setOpenModalCreatePost(true)}>
          Create post
        </Button>
      </div>
      <div className="flex gap-3">
        <div className="relative w-full h-full">
          <Input
            placeholder="Search..."
            className="h-full pl-8 pr-3 py-3 w-1/3 min-w-[180px]"
          />
          <Image
            src={SearchIcon}
            alt="Search icon"
            width={20}
            height={20}
            className="absolute top-1/2 -translate-y-1/2 left-2"
          />
        </div>
      </div>
      <CreatePostModal
        open={openModalCreatePost}
        creationData={listCreationData?.data}
        onSubmit={onSubmitCreatePost}
        onClose={() => setOpenModalCreatePost(false)}></CreatePostModal>
    </div>
  );
};

export default Posts;
