'use client';
import { Fragment, ReactNode, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import { usePathname } from 'next/navigation';

import { AuthenticationStatus, RoleTypes } from '@app/_constants/enums';
import {
  AdminIcon,
  CloseIcon,
  CloseWhiteIcon,
  DefaultUserIcon,
  DownWhiteIcon,
  LogoutIcon,
  MenuIcon,
  SettingIcon,
} from 'public/icons';
import { logo } from 'public/images';
import { adminRouter, pageRouter } from '@app/_constants/routers';

type Props = { className?: string; link?: string; children?: ReactNode };
const navigation = [
  { name: 'Home', href: pageRouter.HOME },
  { name: 'Blogs', href: '/blogs' },
  { name: 'About me', href: './about-me' },
  { name: 'Contact me', href: '/contact-me' },
];

const Header = ({}: Props) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openPopupUser, setOpenPopupUser] = useState(false);
  return (
    <header className="bg-dark text-white border-b">
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
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
            onClick={() => setMobileMenuOpen(true)}>
            <Image src={MenuIcon} alt="Menu header" width={24} height={24} />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12 ">
          {navigation.map((element, index) => (
            <Link
              key={index}
              href={element.href}
              className={`${
                pathname === element.href ? 'font-bold' : 'font-light'
              } flex gap-3 rounded-md`}>
              <p className="text-sm hidden lg:block hover:font-bold">
                {element.name}
              </p>
            </Link>
          ))}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {status === AuthenticationStatus.UNAUTHENTICATED ? (
            <Link
              href={pageRouter.LOGIN}
              className="text-sm font-light leading-6">
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
                    <p className="text-sm font-normal leading-6">
                      {session?.user?.profile?.firstName +
                        session?.user?.profile?.firstName ||
                        session?.user?.profile?.firstName ||
                        session?.user?.profile?.lastName ||
                        session?.user?.role}
                    </p>
                    <Image
                      src={DownWhiteIcon}
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
                    <Disclosure.Panel className="absolute right-0 flex flex-col text-sm font-normal rounded-md min-w-[128px] bg-dark text-white transition-all duration-300 z-10">
                      <Link
                        href={pageRouter.PROFILE}
                        className="flex gap-2 hover:bg-slate-600 p-3">
                        <Image
                          alt="Setting profile"
                          src={SettingIcon}
                          width={18}
                          height={18}
                        />
                        Profile
                      </Link>
                      {session?.user.role === RoleTypes.ADMIN && (
                        <Link
                          href={adminRouter.USERS}
                          className="flex gap-2 hover:bg-slate-600 p-3">
                          <Image
                            alt="Management profile"
                            src={AdminIcon}
                            width={18}
                            height={18}
                          />
                          Management
                        </Link>
                      )}
                      <div
                        className="flex gap-2 hover:bg-slate-600 hover:cursor-pointer p-3"
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
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-dark text-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <Image alt="Logo header" src={logo} width={40} height={40} />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(false)}>
              <Image
                src={CloseWhiteIcon}
                alt="Close header"
                width={24}
                height={24}
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y ">
              <div className="space-y-2 py-6 text-white">
                {navigation.map((element, index) => (
                  <Link
                    key={index}
                    href={element.href}
                    className={`${
                      pathname === element.href ? 'bg-slate-600' : ''
                    } -mx-3 block rounded-lg px-3 py-2 font-medium text-base leading-7 hover:bg-slate-600`}>
                    {element.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {status === AuthenticationStatus.UNAUTHENTICATED ? (
                  <Link
                    href={pageRouter.LOGIN}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base leading-7 hover:bg-slate-600">
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
                      href={pageRouter.PROFILE}
                      className="flex gap-2 hover:bg-slate-600 rounded-lg py-2 px-5">
                      <Image
                        alt="Setting profile"
                        src={SettingIcon}
                        width={18}
                        height={18}
                      />
                      Profile
                    </Link>
                    {session?.user.role === RoleTypes.ADMIN && (
                      <Link
                        href={adminRouter.USERS}
                        className="flex gap-2 hover:bg-slate-600 rounded-lg py-2 px-5">
                        <Image
                          alt="Management profile"
                          src={AdminIcon}
                          width={18}
                          height={18}
                        />
                        Management
                      </Link>
                    )}
                    <div
                      className="flex gap-2 hover:bg-slate-600 rounded-lg hover:cursor-pointer py-2 px-5"
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
