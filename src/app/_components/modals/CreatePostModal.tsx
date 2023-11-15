import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import RichTextEditor from '../common/RichTextEditor';
import Button from '../common/Button';
import { PostForm } from '@app/_interfaces/post';
import TagsInput from '../common/TagsInput';
type Props = {
  open: boolean;
  onSubmit: SubmitHandler<PostForm>;
  onClose: () => void;
};

const CreatePostModal = ({ open, onClose, onSubmit }: Props) => {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PostForm>({
    mode: 'onSubmit',
  });

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Create Post"
      onClose={handleCloseModal}
      className="w-[calc(100vw_-_10rem)]">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Title"
          placeholder="Title"
          register={register('title')}
          className="w-full h-11 p-5 text-sm font-light"
        />
        <Controller
          control={control}
          name="category"
          defaultValue={{ value: '1', label: '1' }}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Category"
              className="w-full h-11"
              data={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
              ]}
              defaultOption={value}
              onSelectedOptionChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="tag"
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <TagsInput
              label="Tag"
              defaultValue={value}
              onTagOptionChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange } }) => (
            <RichTextEditor
              label="Content"
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
