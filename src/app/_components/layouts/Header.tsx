'use client';
import { Fragment, ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';

import { AuthenticationStatus } from '@app/_constants/enums';
import {
  CloseIcon,
  DefaultUserIcon,
  DownIcon,
  LogoutIcon,
  MenuIcon,
  SettingIcon,
} from 'public/icons';
import { logo } from 'public/images';
import { pageRouter } from '@app/_constants/routers';

type Props = { className?: string; link?: string; children?: ReactNode };

const Header = ({}: Props) => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openPopupUser, setOpenPopupUser] = useState(false);
  return (
    <header className="bg-lightgrey text-black border-b">
      <nav
        className="mx-auto flex items-center justify-between p-3 lg:px-4"
        aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href={pageRouter.HOME} className="-m-1.5 p-1.5">
            <Image alt="Logo header" src={logo} width={40} height={40} />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-black"
            onClick={() => setMobileMenuOpen(true)}>
            <Image src={MenuIcon} alt="Menu header" width={24} height={24} />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12 text-black">
          <Link
            href={pageRouter.HOME}
            className="text-sm font-semibold leading-6">
            Home
          </Link>
          <Link href="#" className="text-sm font-semibold leading-6">
            Blogs
          </Link>
          <Link href="#" className="text-sm font-semibold leading-6">
            About me
          </Link>
          <Link href="#" className="text-sm font-semibold leading-6">
            Contact me
          </Link>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {status === AuthenticationStatus.UNAUTHENTICATED ? (
            <Link
              href={pageRouter.LOGIN}
              className="text-sm font-semibold leading-6">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <Disclosure as="div" className="relative">
              {({}) => (
                <>
                  <Disclosure.Button
                    className="flex w-full gap-1 items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7"
                    onClick={() => setOpenPopupUser(!openPopupUser)}>
                    <Image
                      src={session?.user?.profile?.avatar || DefaultUserIcon}
                      alt="Default user icon"
                      width={30}
                      height={30}
                    />
                    <p>
                      {session?.user?.profile?.firstName +
                        session?.user?.profile?.firstName ||
                        session?.user?.profile?.firstName ||
                        session?.user?.profile?.lastName ||
                        session?.user?.role}
                    </p>
                    <Image
                      src={DownIcon}
                      alt="Down icon header"
                      width={24}
                      height={24}
                      className={`transition-all duration-300 ${
                        openPopupUser ? '-scale-100' : ''
                      }`}
                    />
                  </Disclosure.Button>
                  <Transition
                    show={openPopupUser}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1">
                    <Disclosure.Panel className="absolute right-0 flex flex-col text-sm font-normal rounded-md min-w-[128px] bg-white transition-all duration-300 z-10">
                      <Link
                        href={'/'}
                        className="flex gap-2 hover:bg-lightgrey p-3">
                        <Image
                          alt="Setting profile"
                          src={SettingIcon}
                          width={18}
                          height={18}
                        />
                        Profile
                      </Link>
                      <div
                        className="flex gap-2 hover:bg-lightgrey hover:cursor-pointer p-3"
                        onClick={() => signOut()}>
                        <Image
                          alt="SignOut"
                          src={LogoutIcon}
                          width={18}
                          height={18}
                        />
                        Signout
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-lightgrey px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <Image alt="Logo header" src={logo} width={40} height={40} />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-black"
              onClick={() => setMobileMenuOpen(false)}>
              <Image
                src={CloseIcon}
                alt="Close header"
                width={24}
                height={24}
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6 text-black">
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-white">
                  Home
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-white">
                  Blogs
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-white">
                  About me
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-white">
                  Contact me
                </Link>
              </div>
              <div className="py-6">
                {status === AuthenticationStatus.UNAUTHENTICATED ? (
                  <Link
                    href={pageRouter.LOGIN}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-white">
                    Log in
                  </Link>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex gap-3 items-center py-2">
                      <Image
                        src={session?.user?.profile?.avatar || DefaultUserIcon}
                        alt="Default user icon"
                        width={30}
                        height={30}
                      />
                      <p>
                        {session?.user?.profile?.firstName +
                          session?.user?.profile?.firstName ||
                          session?.user?.profile?.firstName ||
                          session?.user?.profile?.lastName ||
                          session?.user?.role}
                      </p>
                    </div>
                    <Link
                      href={'/'}
                      className="flex gap-2 hover:bg-white py-2 px-5">
                      <Image
                        alt="Setting profile"
                        src={SettingIcon}
                        width={18}
                        height={18}
                      />
                      Profile
                    </Link>
                    <div
                      className="flex gap-2 hover:bg-white hover:cursor-pointer py-2 px-5"
                      onClick={() => signOut()}>
                      <Image
                        alt="SignOut"
                        src={LogoutIcon}
                        width={18}
                        height={18}
                      />
                      Signout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
