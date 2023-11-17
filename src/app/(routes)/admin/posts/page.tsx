'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery } from '@tanstack/react-query';
import Input from '@app/_components/common/Input';
import { SubmitHandler } from 'react-hook-form';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import Button from '@app/_components/common/Button';
import CreatePostModal from '@app/_components/modals/CreatePostModal';
import { CreationData, Post, PostData, PostForm } from '@app/_interfaces/post';
import api from '@app/_base/api';
import { apiRouters } from '@app/_constants/routers';
import { DeleteIcon, EditIcon, SearchIcon, UserIcon } from 'public/icons';
import { LoadingContext } from '@app/_context/loading';
import { ErrorResponse } from '@app/_interfaces';
import ConfirmDelete from '@app/_components/modals/ConfirmDelete';

const columnHelper = createColumnHelper<Post>();

const Posts = () => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<Post[]>([]);
  const [postSelected, setPostSelected] = useState<Post>();
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [openModalUpdatePost, setOpenModalUpdatePost] = useState(false);
  const [openModalCreatePost, setOpenModalCreatePost] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.id, {
        id: 'id',
        cell: (info) => <p className="w-20 truncate">{info.getValue()}</p>,
        header: () => <span>ID</span>,
      }),
      columnHelper.accessor((row) => row.title, {
        id: 'title',
        cell: (info) => <p className="w-20 truncate">{info.getValue()}</p>,
        header: () => <span>Title</span>,
      }),
      columnHelper.accessor((row) => row.category, {
        id: 'category',
        cell: (info) => (
          <ul>
            {info.getValue().map((item, index) => {
              return (
                <p key={index} className="w-20 truncate">
                  - {item.category.name}
                </p>
              );
            })}
          </ul>
        ),
        header: () => <span>Category</span>,
      }),
      columnHelper.accessor((row) => row.tag, {
        id: 'tag',
        cell: (info) => (
          <ul>
            {info.getValue().map((item, index) => {
              return (
                <p key={index} className="w-20 truncate">
                  - {item.tag.name}
                </p>
              );
            })}
          </ul>
        ),
        header: () => <span>Tag</span>,
      }),
      columnHelper.accessor((row) => row.user, {
        id: 'avatar user',
        cell: (info) => (
          <Image
            className="rounded-full"
            alt="Avatar user"
            src={info.getValue().profile.avatar || UserIcon}
            width={32}
            height={32}
          />
        ),
        header: () => <span>Author</span>,
      }),
      columnHelper.accessor((row) => row.id, {
        id: 'action',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Edit post"
              src={EditIcon}
              width={20}
              height={20}
              onClick={() => {
                setOpenModalUpdatePost(true);
                setPostSelected(row.original);
              }}
            />
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Delete post"
              src={DeleteIcon}
              width={20}
              height={20}
              onClick={() => {
                setOpenModalConfirmDelete(true);
                setPostSelected(row.original);
              }}
            />
          </div>
        ),
      }),
    ],
    []
  );
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

  // GET POST
  const getPosts = async () => {
    setIsLoading(true);
    return await api.get<Post[]>(apiRouters.POST_LIST);
  };

  const {
    data: listPosts,
    refetch: refetchListPosts,
    isFetched: isFetchedListPosts,
  } = useQuery({
    enabled: true,
    refetchOnMount: true,
    queryKey: ['getListPosts'],
    queryFn: getPosts,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetchedListPosts) {
      setIsLoading(false);
    }
  }, [isFetchedListPosts]);

  useEffect(() => {
    if (listPosts) {
      setData(listPosts.data);
    }
  }, [listPosts]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // CREATE POST
  const createPostFn = async (data: PostData) => {
    setIsLoading(true);
    return await api.post(apiRouters.POST_LIST, data);
  };

  const { mutate: createPost } = useMutation({
    mutationKey: ['postCreatePost'],
    mutationFn: createPostFn,
    onSuccess: async () => {
      toast.success('Create post successfully');
      refetchListPosts();
      setOpenModalCreatePost(false);
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmitCreatePost: SubmitHandler<PostForm> = (values) => {
    const postData: PostData = {
      ...values,
      category: values.category.value,
      tag: values.tag.map((t) => t.value),
    };
    createPost(postData);
  };

  // DELETE POST
  const handleConfirmDeletePost = () => {
    if (postSelected) {
      deletedPost(postSelected.id);
    }
  };

  const deletePostFn = async (id: string) => {
    setIsLoading(true);
    return await api.delete(apiRouters.POST_DETAIL(id));
  };

  const { mutate: deletedPost } = useMutation({
    mutationKey: ['deletePost'],
    mutationFn: deletePostFn,
    onSuccess: async () => {
      toast.success('Delete successfully');
      refetchListPosts();
    },
    onError: () => {},
    onSettled: () => {
      setIsLoading(false);
      setOpenModalConfirmDelete(false);
    },
  });

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
      <table className="border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className="border">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="border">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  <div className="flex w-full h-full justify-center items-center my-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <CreatePostModal
        open={openModalCreatePost}
        creationData={listCreationData?.data}
        onSubmit={onSubmitCreatePost}
        onClose={() => setOpenModalCreatePost(false)}></CreatePostModal>
      <ConfirmDelete
        open={openModalConfirmDelete}
        variant="Post"
        data={postSelected?.title}
        onConfirm={() => handleConfirmDeletePost()}
        onClose={() => setOpenModalConfirmDelete(false)}></ConfirmDelete>
    </div>
  );
};

export default Posts;
