'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AxiosError } from 'axios';

import { LoadingContext } from '@app/_context/loading';
import api from '@app/_base/api';
import { apiRouters } from '@app/_constants/routers';
import { ActiveIcon, DeleteIcon, EditIcon, SearchIcon } from 'public/icons';
import Button from '@app/_components/common/Button';
import Input from '@app/_components/common/Input';
import ConfirmDelete from '@app/_components/modals/ConfirmDelete';
import { Tag, TagForm } from '@app/_interfaces/tag';
import { ErrorResponse } from '@app/_interfaces';
import CreateCategoryOrTagModal from '@app/_components/modals/CreateCategoryOrTagModal';

const columnHelper = createColumnHelper<Tag>();

const Tags = () => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<Tag[]>([]);
  const [tagSelected, setTagSelected] = useState<Tag>();
  const [openModalCreateTag, setOpenModalCreateTag] = useState(false);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [openModalUpdateTag, setOpenModalUpdateTag] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.id, {
        id: 'id',
        cell: (info) => <p className="w-20 truncate">{info.getValue()}</p>,
        header: () => <span>ID</span>,
      }),
      columnHelper.accessor((row) => row.name, {
        id: 'tag',
        cell: (info) => info.getValue(),
        header: () => <span>Tag</span>,
      }),
      columnHelper.accessor((row) => row.publicStatus, {
        id: 'status',
        cell: (info) =>
          info.getValue() ? (
            <Image
              alt="Status category"
              src={ActiveIcon}
              width={18}
              height={18}
            />
          ) : (
            ''
          ),
        header: () => <span>Status</span>,
      }),
      columnHelper.accessor((row) => row._count.post, {
        id: 'post',
        cell: (info) => info.getValue(),
        header: () => <span>Post</span>,
      }),
      columnHelper.accessor((row) => row.id, {
        id: 'action',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Edit category"
              src={EditIcon}
              width={20}
              height={20}
              onClick={() => {
                setOpenModalUpdateTag(true);
                setTagSelected(row.original);
              }}
            />
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Delete category"
              src={DeleteIcon}
              width={20}
              height={20}
              onClick={() => {
                setOpenModalConfirmDelete(true);
                setTagSelected(row.original);
              }}
            />
          </div>
        ),
      }),
    ],
    []
  );

  // GET TAG
  const getTags = async () => {
    setIsLoading(true);
    return await api.get<Tag[]>(apiRouters.TAG_LIST);
  };

  const {
    data: listTags,
    refetch: refetchListTags,
    isFetched: isFetchedListTags,
  } = useQuery({
    enabled: true,
    refetchOnMount: true,
    queryKey: ['getListTags'],
    queryFn: getTags,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetchedListTags) {
      setIsLoading(false);
    }
  }, [isFetchedListTags]);

  useEffect(() => {
    if (listTags) {
      setData(listTags.data);
    }
  }, [listTags]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // CREATE TAG
  const createTagFn = async (data: TagForm) => {
    setIsLoading(true);
    return await api.post(apiRouters.TAG_LIST, data);
  };

  const { mutate: createTag } = useMutation({
    mutationKey: ['postCreateTag'],
    mutationFn: createTagFn,
    onSuccess: async () => {
      toast.success('Create tag successfully');
      refetchListTags();
      setOpenModalCreateTag(false);
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmitCreateTag: SubmitHandler<TagForm> = (values) => {
    createTag(values);
  };

  // UPDATE CATEGORY
  const updateTagFn = async (data: TagForm) => {
    if (tagSelected) {
      setIsLoading(true);
      return await api.patch(apiRouters.TAG_DETAIL(tagSelected?.id), data);
    }
  };

  const { mutate: updateTag } = useMutation({
    mutationKey: ['postUpdateTag'],
    mutationFn: updateTagFn,
    onSuccess: async () => {
      toast.success('Update tag successfully');
      refetchListTags();
      setOpenModalUpdateTag(false);
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmitUpdateTag: SubmitHandler<TagForm> = (values) => {
    updateTag(values);
  };

  // DELETE TAG
  const handleConfirmDeleteTag = () => {
    if (tagSelected) {
      deletedTag(tagSelected.id);
    }
  };

  const deleteTagFn = async (id: string) => {
    setIsLoading(true);
    return await api.delete(apiRouters.TAG_DETAIL(id));
  };

  const { mutate: deletedTag } = useMutation({
    mutationKey: ['deleteTag'],
    mutationFn: deleteTagFn,
    onSuccess: async () => {
      toast.success('Delete successfully');
      refetchListTags();
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
        <p className="font-bold text-xl">Tag management</p>
        <Button
          className="w-[148px] h-10"
          onClick={() => setOpenModalCreateTag(true)}>
          Create tag
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
        <tbody className="border font-normal">
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
      <CreateCategoryOrTagModal
        open={openModalCreateTag}
        type="create"
        variant="Tag"
        onSubmit={onSubmitCreateTag}
        onClose={() => setOpenModalCreateTag(false)}></CreateCategoryOrTagModal>

      <CreateCategoryOrTagModal
        open={openModalUpdateTag}
        type="update"
        variant="Tag"
        data={tagSelected}
        onSubmit={onSubmitUpdateTag}
        onClose={() => setOpenModalUpdateTag(false)}></CreateCategoryOrTagModal>

      <ConfirmDelete
        open={openModalConfirmDelete}
        variant="Tag"
        data={tagSelected?.name}
        onConfirm={() => handleConfirmDeleteTag()}
        onClose={() => setOpenModalConfirmDelete(false)}></ConfirmDelete>
    </div>
  );
};

export default Tags;
