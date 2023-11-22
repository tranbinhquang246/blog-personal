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
import CreateCategoryOrTagModal from '@app/_components/modals/CreateCategoryOrTagModal';
import ConfirmDelete from '@app/_components/modals/ConfirmDelete';

import { Category, CategoryForm } from '@app/_interfaces/category';
import { ErrorResponse } from '@app/_interfaces';
import api from '@app/_base/api';
import { apiRouters } from '@app/_constants/routers';
import { LoadingContext } from '@app/_context/loading';
import { ActiveIcon, DeleteIcon, EditIcon, SearchIcon } from 'public/icons';

const columnHelper = createColumnHelper<Category>();

const Categories = () => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected] = useState<Category>();
  const [openModalCreateCategory, setOpenModalCreateCategory] = useState(false);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [openModalUpdateCategory, setOpenModalUpdateCategory] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.id, {
        id: 'id',
        cell: (info) => <p className="w-40 truncate">{info.getValue()}</p>,
        header: () => <span>ID</span>,
      }),
      columnHelper.accessor((row) => row.name, {
        id: 'category',
        cell: (info) => info.getValue(),
        header: () => <span>Category</span>,
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
                setOpenModalUpdateCategory(true);
                setCategorySelected(row.original);
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
                setCategorySelected(row.original);
              }}
            />
          </div>
        ),
      }),
    ],
    []
  );

  // GET CATEGORY
  const getCategories = async () => {
    setIsLoading(true);
    return await api.get<Category[]>(apiRouters.CATEGORY_LIST);
  };

  const {
    data: listCategories,
    refetch: refetchListCategories,
    isFetched: isFetchedListCategories,
  } = useQuery({
    enabled: true,
    refetchOnMount: true,
    queryKey: ['getListCategories'],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFetchedListCategories) {
      setIsLoading(false);
    }
  }, [isFetchedListCategories]);

  useEffect(() => {
    if (listCategories) {
      setData(listCategories.data);
    }
  }, [listCategories]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // CREATE CATEGORY
  const createCategoryFn = async (data: CategoryForm) => {
    setIsLoading(true);
    return await api.post(apiRouters.CATEGORY_LIST, data);
  };

  const { mutate: createCategory } = useMutation({
    mutationKey: ['postCreateCategory'],
    mutationFn: createCategoryFn,
    onSuccess: async () => {
      toast.success('Create category successfully');
      refetchListCategories();
      setOpenModalCreateCategory(false);
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmitCreateCategory: SubmitHandler<CategoryForm> = (values) => {
    createCategory(values);
  };

  // UPDATE CATEGORY
  const updateCategoryFn = async (data: CategoryForm) => {
    if (categorySelected) {
      setIsLoading(true);
      return await api.patch(
        apiRouters.CATEGORY_DETAIL(categorySelected?.id),
        data
      );
    }
  };

  const { mutate: updateCategory } = useMutation({
    mutationKey: ['postUpdateCategory'],
    mutationFn: updateCategoryFn,
    onSuccess: async () => {
      toast.success('Update category successfully');
      refetchListCategories();
      setOpenModalUpdateCategory(false);
    },
    onError: (errors: AxiosError<ErrorResponse>) => {
      toast.error(errors.response?.data.message);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmitUpdateCategory: SubmitHandler<CategoryForm> = (values) => {
    updateCategory(values);
  };

  // DELETE CATEGORY
  const handleConfirmDeleteCategory = () => {
    if (categorySelected) {
      deletedCategory(categorySelected.id);
    }
  };

  const deleteCategoryFn = async (id: string) => {
    setIsLoading(true);
    return await api.delete(apiRouters.CATEGORY_DETAIL(id));
  };

  const { mutate: deletedCategory } = useMutation({
    mutationKey: ['deleteCategory'],
    mutationFn: deleteCategoryFn,
    onSuccess: async () => {
      toast.success('Delete successfully');
      refetchListCategories();
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
        <p className="font-bold text-xl">Category management</p>
        <Button
          className="w-[148px] h-10"
          onClick={() => setOpenModalCreateCategory(true)}>
          Create category
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
      <CreateCategoryOrTagModal
        open={openModalCreateCategory}
        type="create"
        variant="Category"
        onSubmit={onSubmitCreateCategory}
        onClose={() =>
          setOpenModalCreateCategory(false)
        }></CreateCategoryOrTagModal>

      <CreateCategoryOrTagModal
        open={openModalUpdateCategory}
        type="update"
        variant="Category"
        data={categorySelected}
        onSubmit={onSubmitUpdateCategory}
        onClose={() =>
          setOpenModalUpdateCategory(false)
        }></CreateCategoryOrTagModal>

      <ConfirmDelete
        open={openModalConfirmDelete}
        variant="Category"
        data={categorySelected?.name}
        onConfirm={() => handleConfirmDeleteCategory()}
        onClose={() => setOpenModalConfirmDelete(false)}></ConfirmDelete>
    </div>
  );
};

export default Categories;
