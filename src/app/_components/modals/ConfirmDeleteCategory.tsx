import React from 'react';
import Image from 'next/image';

import Modal from '../common/Modal';
import Button from '../common/Button';

import { Category } from '@app/_interfaces/category';
import { WarningIcon } from 'public/icons';

type Props = {
  open: boolean;
  category?: Category;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmDeleteCategory = ({
  onClose,
  onConfirm,
  open,
  category,
}: Props) => {
  return (
    <Modal open={open} onClose={onClose} className="w-[480px]">
      <div className="flex items-start gap-5">
        <Image
          className=""
          alt="Warning delete category"
          src={WarningIcon}
          width={32}
          height={32}
        />
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">Delete category</p>
          <p>{`Are you sure you want to delete category: ${category?.name}`}</p>
        </div>
      </div>
      <div className="flex justify-center gap-8 px-10 pt-5 pb-2">
        <Button className="h-10 w-[7.5rem]" onClick={() => onClose()}>
          Cancel
        </Button>

        <Button className="h-10 w-[7.5rem]" onClick={() => onConfirm()}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteCategory;
