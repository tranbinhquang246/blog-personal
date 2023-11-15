'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Input from '@app/_components/common/Input';
import { SearchIcon } from 'public/icons';
import Button from '@app/_components/common/Button';
import CreatePostModal from '@app/_components/modals/CreatePostModal';
import { PostForm } from '@app/_interfaces/post';
import { SubmitHandler } from 'react-hook-form';

const Posts = () => {
  const [openModalCreatePost, setOpenModalCreatePost] = useState(false);
  const onSubmitCreatePost: SubmitHandler<PostForm> = (values) => {};
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
        onSubmit={onSubmitCreatePost}
        onClose={() => setOpenModalCreatePost(false)}></CreatePostModal>
    </div>
  );
};

export default Posts;
