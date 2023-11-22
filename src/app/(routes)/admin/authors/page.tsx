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

import Button from '@app/_components/common/Button';
import Input from '@app/_components/common/Input';
import { LoadingContext } from '@app/_context/loading';
import { DeleteIcon, EditIcon, SearchIcon } from 'public/icons';
import CreateAuthorModal from '@app/_components/modals/CreateAuthorModal';
import { Author, AuthorForm, AuthorFormPost } from '@app/_interfaces/author';
import { apiRouters } from '@app/_constants/routers';
import api from '@app/_base/api';
import { ErrorResponse } from '@app/_interfaces';
import ConfirmDelete from '@app/_components/modals/ConfirmDelete';

const columnHelper = createColumnHelper<Author>();

const Authors = () => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<Author[]>([]);
  const [authorSelected, setAuthorSelected] = useState<Author>();
  const [openModalCreateAuthor, setOpenModalCreateAuthor] = useState(false);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [openModalUpdateAuthor, setOpenModalUpdateAuthor] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.fullName, {
        id: 'fullName',
        cell: (info) => <p className="w-40 truncate">{info.getValue()}</p>,
        header: () => <span>Full Name</span>,
      }),
      columnHelper.accessor((row) => row.aliasName, {
        id: 'aliasName',
        cell: (info) => <p className="w-40 truncate">{info.getValue()}</p>,
        header: () => <span>Alias Name</span>,
      }),
      columnHelper.accessor((row) => row.introduction, {
        id: 'introduction',
        cell: (info) => <p className="w-20">{info.getValue()}</p>,
        header: () => <span>Introduction</span>,
      }),
      columnHelper.accessor((row) => row.reason, {
        id: 'reason',
        cell: (info) => (
          <ul>
            {info.getValue().map((item, index) => {
              return (
                <p key={index} className="w-40 truncate">
                  - {item}
                </p>
              );
            })}
          </ul>
        ),
        header: () => <span>Reason</span>,
      }),
      columnHelper.accessor((row) => row.experience, {
        id: 'experience',
        cell: (info) => (
          <ul>
            {info.getValue().map((item, index) => {
              return (
                <p key={index} className="w-40 truncate">
                  - {item}
                </p>
              );
            })}
          </ul>
        ),
        header: () => <span>Experience</span>,
      }),
      columnHelper.accessor((row) => row.interest, {
        id: 'interest',
        cell: (info) => (
          <ul>
            {info.getValue().map((item, index) => {
              return (
                <p key={index} className="w-40 truncate">
                  - {item}
                </p>
              );
            })}
          </ul>
        ),
        header: () => <span>Interest</span>,
      }),
      columnHelper.accessor((row) => row.target, {
        id: 'target',
        cell: (info) => (
          <ul>
            {info.getValue().map((item, index) => {
              return (
                <p key={index} className="w-40 truncate">
                  - {item}
                </p>
              );
            })}
          </ul>
        ),
        header: () => <span>Target</span>,
      }),
      columnHelper.accessor((row) => row.id, {
        id: 'action',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Edit author"
              src={EditIcon}
              width={20}
              height={20}
              onClick={() => {
                setOpenModalUpdateAuthor(true);
                setAuthorSelected(row.original);
              }}
            />
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Delete author"
              src={DeleteIcon}
              width={20}
              height={20}
              onClick={() => {
                setOpenModalConfirmDelete(true);
                setAuthorSelected(row.original);
              }}
            />
          </div>
        ),
      }),
    ],
    []
  );

  // GET AUTHOR
  const getAuthors = async () => {
    setIsLoading(true);
    return await api.get<Author[]>(apiRouters.AUTHOR_LIST);
  };

  const {
    data: listAuthors,
    refetch: refetchListAuthors,
    isFetched: isFetchedListAuthors,
  } = useQuery({
    enabled: true,
    refetchOnMount: true,
    queryKey: ['getListAuthors'],
    queryFn: getAuthors,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetchedListAuthors) {
      setIsLoading(false);
    }
  }, [isFetchedListAuthors]);

  useEffect(() => {
    if (listAuthors) {
      setData(listAuthors.data);
    }
  }, [listAuthors]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // CREATE AUTHOR
  const createAuthorFn = async (data: AuthorFormPost) => {
    setIsLoading(true);
    return await api.post(apiRouters.AUTHOR_LIST, data);
  };

  const { mutate: createAuthor } = useMutation({
    mutationKey: ['postCreateAuthor'],
    mutationFn: createAuthorFn,
    onSuccess: async () => {
      toast.success('Create author successfully');
      refetchListAuthors();
      setOpenModalCreateAuthor(false);
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  const onSubmitCreateAuthor: SubmitHandler<AuthorForm> = (values) => {
    const transformedData = {
      ...values,
      reason: values.reason.filter((r) => r.value).map((r) => r.value),
      target: values.target.filter((t) => t.value).map((t) => t.value),
      experience: values.experience.filter((e) => e.value).map((e) => e.value),
      interest: values.interest.filter((i) => i.value).map((i) => i.value),
    };
    createAuthor(transformedData);
  };

  // UPDATE AUTHOR
  const updateAuthorFn = async (data: AuthorFormPost) => {
    if (authorSelected) {
      setIsLoading(true);
      return await api.patch(
        apiRouters.AUTHOR_DETAIL(authorSelected?.id),
        data
      );
    }
  };

  const { mutate: updateAuthor } = useMutation({
    mutationKey: ['postUpdateAuthor'],
    mutationFn: updateAuthorFn,
    onSuccess: async () => {
      toast.success('Update author successfully');
      refetchListAuthors();
      setOpenModalUpdateAuthor(false);
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmitUpdateAuthor: SubmitHandler<AuthorForm> = (values) => {
    const transformedData = {
      ...values,
      reason: values.reason.filter((r) => r.value).map((r) => r.value),
      target: values.target.filter((t) => t.value).map((t) => t.value),
      experience: values.experience.filter((e) => e.value).map((e) => e.value),
      interest: values.interest.filter((i) => i.value).map((i) => i.value),
    };
    updateAuthor(transformedData);
  };

  // DELETE AUTHOR
  const handleConfirmDeleteAuthor = () => {
    if (authorSelected) {
      deletedAuthor(authorSelected.id);
    }
  };

  const deleteAuthorFn = async (id: string) => {
    setIsLoading(true);
    return await api.delete(apiRouters.AUTHOR_DETAIL(id));
  };

  const { mutate: deletedAuthor } = useMutation({
    mutationKey: ['deleteAuthor'],
    mutationFn: deleteAuthorFn,
    onSuccess: async () => {
      toast.success('Delete successfully');
      refetchListAuthors();
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
        <p className="font-bold text-xl">Author management</p>
        <Button
          className="w-[148px] h-10"
          onClick={() => setOpenModalCreateAuthor(true)}>
          Create author
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
      <CreateAuthorModal
        open={openModalCreateAuthor}
        type="create"
        onClose={() => setOpenModalCreateAuthor(false)}
        onSubmit={onSubmitCreateAuthor}></CreateAuthorModal>

      <CreateAuthorModal
        open={openModalUpdateAuthor}
        type="update"
        data={authorSelected}
        onClose={() => setOpenModalUpdateAuthor(false)}
        onSubmit={onSubmitUpdateAuthor}></CreateAuthorModal>

      <ConfirmDelete
        open={openModalConfirmDelete}
        variant="Author"
        data={authorSelected?.fullName}
        onConfirm={() => handleConfirmDeleteAuthor()}
        onClose={() => setOpenModalConfirmDelete(false)}></ConfirmDelete>
    </div>
  );
};

export default Authors;
