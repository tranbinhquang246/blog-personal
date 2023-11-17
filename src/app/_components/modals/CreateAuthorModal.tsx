import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Modal from '../common/Modal';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { AddIcon, CloseIcon } from 'public/icons';
import { Author, AuthorForm } from '@app/_interfaces/author';

type Props = {
  open: boolean;
  type: 'update' | 'create';
  data?: Author;
  onSubmit: SubmitHandler<AuthorForm>;
  onClose: () => void;
};

const schema = yup.object().shape({
  fullName: yup.string().required('This field must not empty!'),
  aliasName: yup.string().required('This field must not empty!'),
  introduction: yup.string().required('This field must not empty!'),
  reason: yup.array().required(),
  target: yup.array().required(),
  interest: yup.array().required(),
  experience: yup.array().required(),
});

const CreateAuthorModal = ({ onClose, onSubmit, open, type, data }: Props) => {
  const defaultValues = useMemo<AuthorForm>(() => {
    if (type === 'update') {
      return {
        aliasName: data?.aliasName || '',
        experience: data?.experience.map((exp) => {
          return {
            value: exp,
          };
        }) || [{ value: '' }],
        fullName: data?.fullName || '',
        interest: data?.interest.map((exp) => {
          return {
            value: exp,
          };
        }) || [{ value: '' }],
        introduction: data?.introduction || '',
        reason: data?.reason.map((exp) => {
          return {
            value: exp,
          };
        }) || [{ value: '' }],
        target: data?.reason.map((exp) => {
          return {
            value: exp,
          };
        }) || [{ value: '' }],
      };
    }
    return {
      aliasName: '',
      experience: [{ value: '' }],
      fullName: '',
      interest: [{ value: '' }],
      introduction: '',
      reason: [{ value: '' }],
      target: [{ value: '' }],
    };
  }, [data, type]);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthorForm>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    data && reset(defaultValues);
  }, [data, reset, defaultValues]);

  const {
    fields: fieldsReason,
    append: appendReason,
    remove: removeReason,
  } = useFieldArray({
    control,
    name: 'reason',
  });

  const {
    fields: fieldsTarget,
    append: appendTarget,
    remove: removeTarget,
  } = useFieldArray({
    control,
    name: 'target',
  });

  const {
    fields: fieldsExperience,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'experience',
  });

  const {
    fields: fieldsInterest,
    append: appendInterest,
    remove: removeInterest,
  } = useFieldArray({
    control,
    name: 'interest',
  });

  useEffect(() => {
    if (type === 'update') {
      return;
    }
    appendReason({ value: '' });
    appendExperience({ value: '' });
    appendTarget({ value: '' });
    appendInterest({ value: '' });
  }, [type]);

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
      title="Create Author"
      onClose={handleCloseModal}
      className="w-[calc(100vw_-_60rem)] min-w-[560px]">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          register={register('fullName')}
          className="w-full h-11 p-5 text-sm font-light"
          error={errors.fullName?.message}
        />
        <Input
          label="Alias Name"
          register={register('aliasName')}
          className="w-full h-11 p-5 text-sm font-light"
          error={errors.aliasName?.message}
        />

        <TextArea
          label="Introduction"
          className="w-full p-5 text-sm font-light"
          register={register('introduction')}
          error={errors.introduction?.message}
        />
        <div className="flex flex-col gap-1">
          <p className="block leading-5 text-sm">Reason</p>

          {fieldsReason.map((field, index) => (
            <Controller
              key={index}
              control={control}
              name={`reason.${index}.value`}
              render={({ field: { onChange, value } }) => (
                <div className="flex w-full gap-5">
                  <Input
                    key={field.id}
                    value={value}
                    onChange={onChange}
                    className="flex-grow p-3 text-sm font-light"
                  />
                  <Image
                    alt="Remove field icon"
                    className="hover:cursor-pointer"
                    src={CloseIcon}
                    width={24}
                    height={24}
                    onClick={() => removeReason(index)}
                  />
                </div>
              )}
            />
          ))}

          <Button
            type="button"
            className="w-fit gap-2 border-none p-1 text-sm font-light"
            onClick={() => {
              appendReason({ value: '' });
            }}>
            <Image alt="Add icon" src={AddIcon} width={18} height={18} />
            Add more reason
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="block leading-5 text-sm">Target</p>

          {fieldsTarget.map((field, index) => (
            <Controller
              key={index}
              control={control}
              name={`target.${index}.value`}
              render={({ field: { onChange, value } }) => (
                <div className="flex w-full gap-5">
                  <Input
                    key={field.id}
                    value={value}
                    onChange={onChange}
                    className="flex-grow p-3 text-sm font-light"
                  />
                  <Image
                    alt="Remove field icon"
                    className="hover:cursor-pointer"
                    src={CloseIcon}
                    width={24}
                    height={24}
                    onClick={() => removeTarget(index)}
                  />
                </div>
              )}
            />
          ))}

          <Button
            type="button"
            className="w-fit gap-2 border-none p-1 text-sm font-light"
            onClick={() => {
              appendTarget({ value: '' });
            }}>
            <Image alt="Add icon" src={AddIcon} width={18} height={18} />
            Add more target
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="block leading-5 text-sm">Experience</p>

          {fieldsExperience.map((field, index) => (
            <Controller
              key={index}
              control={control}
              name={`experience.${index}.value`}
              render={({ field: { onChange, value } }) => (
                <div className="flex w-full gap-5">
                  <Input
                    key={field.id}
                    value={value}
                    onChange={onChange}
                    className="flex-grow p-3 text-sm font-light"
                  />
                  <Image
                    alt="Remove field icon"
                    className="hover:cursor-pointer"
                    src={CloseIcon}
                    width={24}
                    height={24}
                    onClick={() => removeExperience(index)}
                  />
                </div>
              )}
            />
          ))}

          <Button
            type="button"
            className="w-fit gap-2 border-none p-1 text-sm font-light"
            onClick={() => {
              appendExperience({ value: '' });
            }}>
            <Image alt="Add icon" src={AddIcon} width={18} height={18} />
            Add more experience
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="block leading-5 text-sm">Interest</p>

          {fieldsInterest.map((field, index) => (
            <Controller
              key={index}
              control={control}
              name={`interest.${index}.value`}
              render={({ field: { onChange, value } }) => (
                <div className="flex w-full gap-5">
                  <Input
                    key={field.id}
                    value={value}
                    onChange={onChange}
                    className="flex-grow p-3 text-sm font-light"
                  />
                  <Image
                    alt="Remove field icon"
                    className="hover:cursor-pointer"
                    src={CloseIcon}
                    width={24}
                    height={24}
                    onClick={() => removeInterest(index)}
                  />
                </div>
              )}
            />
          ))}

          <Button
            type="button"
            className="w-fit gap-2 border-none p-1 text-sm font-light"
            onClick={() => {
              appendInterest({ value: '' });
            }}>
            <Image alt="Add icon" src={AddIcon} width={18} height={18} />
            Add more interest
          </Button>
        </div>

        <Button type="submit" className="h-12">
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default CreateAuthorModal;
