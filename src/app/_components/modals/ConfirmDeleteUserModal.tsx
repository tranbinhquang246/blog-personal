import React from 'react';
import Modal from '../common/Modal';
import Image from 'next/image';
import { WarningIcon } from 'public/icons';
import Button from '../common/Button';
import { User } from '@app/_interfaces/user';

type Props = {
  open: boolean;
  user?: User;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmDeleteUserModal = ({ open, user, onClose, onConfirm }: Props) => {
  return (
    <Modal open={open} onClose={onClose} className="w-[480px]">
      <div className="flex items-start gap-5">
        <Image
          className=""
          alt="Warning delete user"
          src={WarningIcon}
          width={32}
          height={32}
        />
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">Delete User</p>
          <p>{`Are you sure you want to delete user: ${
            user?.profile?.firstName
              ? user.profile.firstName +
                (user.profile.lastName ? ' ' + user.profile.lastName : '')
              : user?.profile?.lastName
              ? user.email
              : user?.email
              ? user.email
              : ''
          }`}</p>
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

export default ConfirmDeleteUserModal;
