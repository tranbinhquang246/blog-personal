import React, { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import RichTextEditor from '../common/RichTextEditor';
import Button from '../common/Button';
import { CreationData, Post, PostForm } from '@app/_interfaces/post';
import TagsInput from '../common/TagsInput';
import { OptionType } from '@app/_interfaces';
import ImageUpload from '../common/UploadImage';
type Props = {
  open: boolean;
  creationData?: CreationData;
  data?: Post;
  type?: 'create' | 'update';
  onSubmit: SubmitHandler<PostForm>;
  onClose: () => void;
};

const CreatePostModal = ({
  open,
  creationData,
  data,
  type,
  onClose,
  onSubmit,
}: Props) => {
  const [categoryOption, setCategoryOption] = useState<OptionType[]>([]);
  const [tagOption, setTagOption] = useState<OptionType[]>([]);

  const defaultValues = useMemo<PostForm>(() => {
    if (type === 'update' && data) {
      return {
        title: data?.title,
        category: {
          label: data.category[0].category.name,
          value: data.category[0].category.id,
        },
        tag: data.tag.map((item) => {
          return {
            label: item.tag.name,
            value: item.tag.id,
          };
        }),
        content: data?.content,
      };
    }
    return {
      title: '',
      category: {
        label: '',
        value: '',
      },
      tag: undefined,
      content: '',
    };
  }, [data, type]);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PostForm>({
    mode: 'onSubmit',
    defaultValues,
  });

  useEffect(() => {
    data && reset(defaultValues);
  }, [data, reset, defaultValues]);

  useEffect(() => {
    if (creationData) {
      setCategoryOption([
        ...categoryOption,
        ...creationData.category.map((element) => ({
          value: element.id,
          label: element.name,
        })),
      ]);

      setTagOption([
        ...tagOption,
        ...creationData.tag.map((element) => ({
          value: element.id,
          label: element.name,
        })),
      ]);
    }
  }, [creationData]);

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    !open && reset();
  }, [open]);

  const checkKeyDown = (e: any) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <Modal
      open={open}
      title={type === 'create' ? `Create Post` : `Update Post`}
      onClose={handleCloseModal}
      className="w-[calc(100vw_-_10rem)]">
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}>
        <Input
          label="Title"
          placeholder="Title"
          register={register('title', {
            required: 'This field must not empty!',
          })}
          className="w-full h-11 p-5 text-sm font-light"
          error={errors.title?.message}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Category"
              className="w-full h-11"
              options={categoryOption}
              defaultOption={value}
              onSelectedOptionChange={onChange}
              error={errors.category?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="tag"
          render={({ field: { onChange, value } }) => (
            <TagsInput
              label="Tag"
              options={tagOption}
              defaultValue={value}
              onTagOptionChange={onChange}
              error={errors.tag?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="thumbnail"
          render={({ field: { onChange } }) => (
            <ImageUpload label="Thumbnail" onChange={onChange} />
          )}
        />
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, value } }) => (
            <RichTextEditor
              label="Content"
              defaultValue={value}
              className="h-[486px]"
              classNameEditor="h-[420px]"
              onEditorChange={onChange}
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
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
