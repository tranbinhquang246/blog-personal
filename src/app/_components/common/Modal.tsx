import React, { Fragment, ReactNode, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { CloseIcon } from 'public/icons';

type Props = {
  open: boolean;
  title?: string;
  children?: ReactNode;
  className?: string;
  onClose: () => void;
};

const Modal = ({ open, title, children, className, onClose }: Props) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all overflow-y-auto">
                <div className={className}>
                  {title && (
                    <header className="flex justify-between items-center mb-5">
                      <p className="leading-10 text-neutral-01 text-xl">
                        {title}
                      </p>
                      <Image
                        className="m-[6px] hover:cursor-pointer"
                        src={CloseIcon}
                        alt="Close modal"
                        width={18}
                        height={18}
                        onClick={onClose}
                      />
                    </header>
                  )}
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
