'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'react-toastify';

import Button from '@app/_components/common/Button';
import Input from '@app/_components/common/Input';
import { LoadingContext } from '@app/_context/loading';
import ConfirmDeleteUserModal from '@app/_components/modals/ConfirmDeleteUserModal';

import api from '@app/_base/api';
import { apiRouters } from '@app/_constants/routers';
import { User } from '@app/_interfaces/user';
import { DeleteIcon, EyeIcon, SearchIcon, UserIcon } from 'public/icons';

const columnHelper = createColumnHelper<User>();

const UserManagement = () => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<User[]>([]);
  const [userSelected, setUserSelected] = useState<User>();
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.id, {
        id: 'id',
        cell: (info) => <p className="w-40 truncate">{info.getValue()}</p>,
        header: () => <span>ID</span>,
      }),
      columnHelper.accessor((row) => row.email, {
        id: 'email',
        cell: (info) => info.getValue(),
        header: () => <span>Email</span>,
      }),
      columnHelper.accessor((row) => row.role, {
        id: 'role',
        cell: (info) => info.getValue(),
        header: () => <span>Role</span>,
      }),
      columnHelper.group({
        id: 'profile',
        header: () => <span>Profile</span>,
        columns: [
          columnHelper.accessor((row) => row.profile.firstName, {
            id: 'firstName',
            cell: (info) => info.getValue(),
            header: () => <span>First Name</span>,
          }),
          columnHelper.accessor((row) => row.profile.lastName, {
            id: 'lastName',
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
          }),
          columnHelper.accessor((row) => row.profile.avatar, {
            id: 'avatar',
            cell: (info) => (
              <Image
                className="rounded-full w-8 h-8"
                alt="Avatar user"
                src={info.getValue() || UserIcon}
                width={32}
                height={32}
              />
            ),
            header: () => <span>Avatar</span>,
          }),
        ],
      }),
      columnHelper.accessor((row) => row.id, {
        id: 'action',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Edit user"
              src={EyeIcon}
              width={20}
              height={20}
            />
            <Image
              className="rounded-full hover:cursor-pointer"
              alt="Delete user"
              src={DeleteIcon}
              width={20}
              height={20}
              onClick={() => {
                setOpenModalConfirmDelete(true);
                setUserSelected(row.original);
              }}
            />
          </div>
        ),
      }),
    ],
    []
  );

  const getUsers = async () => {
    setIsLoading(true);
    return await api.get<User[]>(apiRouters.GET_USERS);
  };

  const {
    data: listUsers,
    refetch: refetchListUsers,
    isFetched: isFetchedListUsers,
  } = useQuery({
    queryKey: ['getListUsers'],
    queryFn: getUsers,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetchedListUsers) {
      setIsLoading(false);
    }
  }, [isFetchedListUsers]);

  useEffect(() => {
    if (listUsers) {
      setData(listUsers.data);
    }
  }, [listUsers]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleConfirmDeleteUser = () => {
    if (userSelected) {
      deletedUser(userSelected.id);
    }
  };

  const deleteUserFn = async (id: string) => {
    setIsLoading(true);
    return await api.delete(apiRouters.DELETE_USER(id));
  };

  const { mutate: deletedUser } = useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: deleteUserFn,
    onSuccess: async () => {
      toast.success('Delete successfully');
      refetchListUsers();
    },
    onError: () => {},
    onSettled: () => {
      setIsLoading(false);
      setOpenModalConfirmDelete(false);
    },
  });

  return (
    <div className="flex flex-col gap-5 w-full h-full p-10 text-sm">
      <p className="font-bold text-xl">Users management</p>
      <div className="flex gap-3">
        <div className="relative w-full h-full">
          <Input
            placeholder="Search for email, name"
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

        <Button className="max-w-[64px] px-10 py-1">Search</Button>
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
            <tr key={row.id}>
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
      <ConfirmDeleteUserModal
        open={openModalConfirmDelete}
        user={userSelected}
        onConfirm={() => handleConfirmDeleteUser()}
        onClose={() =>
          setOpenModalConfirmDelete(false)
        }></ConfirmDeleteUserModal>
    </div>
  );
};

export default UserManagement;
