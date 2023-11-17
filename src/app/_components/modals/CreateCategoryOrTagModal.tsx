import React, { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Switch from '../common/Switch';

import { Category, CategoryForm } from '@app/_interfaces/category';
import { Tag } from '@app/_interfaces/tag';

type Props = {
  open: boolean;
  type: 'update' | 'create';
  variant?: 'Category' | 'Tag';
  data?: Category | Tag;
  onSubmit: SubmitHandler<CategoryForm>;
  onClose: () => void;
};

const schema = yup.object().shape({
  name: yup.string().required('This field must not empty!'),
  isPublic: yup.boolean().required('This field must not empty!'),
});

const CreateCategoryOrTagModal = ({
  open,
  variant,
  data,
  type,
  onClose,
  onSubmit,
}: Props) => {
  const defaultValues = useMemo<CategoryForm>(() => {
    if (type === 'update') {
      return {
        name: data?.name || '',
        isPublic: data?.publicStatus || false,
      };
    }
    return {
      name: '',
      isPublic: false,
    };
  }, [data, type]);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryForm>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    data && reset(defaultValues);
  }, [data, reset, defaultValues]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={type === 'create' ? `Create ${variant}` : `Update ${variant}`}
      onClose={handleCloseModal}
      className="w-[calc(100vw_/_2)] min-w-[384px]">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={`${variant} name`}
          register={register('name')}
          className="w-full h-11 p-5 text-sm font-light"
          error={errors.name?.message}
        />

        <Controller
          control={control}
          name="isPublic"
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <Switch
              checked={value}
              label={`Public ${variant?.toLowerCase()}`}
              onSwitchChange={onChange}
            />
          )}
        />
        <div className="flex gap-5 w-full justify-end">
          <Button
            type="button"
            className="w-24 h-12"
            onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button type="submit" className="w-24 h-12">
            {type === 'create' ? 'Create' : 'Update'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCategoryOrTagModal;
