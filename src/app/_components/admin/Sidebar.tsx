'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminRouter } from '@app/_constants/routers';
import {
  AuthorIcon,
  CategoryIcon,
  PostIcon,
  TagIcon,
  TeamIcon,
} from 'public/icons';
import Image from 'next/image';

const navigation = [
  { name: 'Users', href: adminRouter.USERS, icon: TeamIcon },
  { name: 'Posts', href: adminRouter.POST, icon: PostIcon },
  { name: 'Categories', href: adminRouter.CATEGORIES, icon: CategoryIcon },
  { name: 'Tags', href: adminRouter.TAGS, icon: TagIcon },
  { name: 'Authors', href: adminRouter.AUTHORS, icon: AuthorIcon },
];

const SidebarAdmin = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col justify-between w-full border-r">
      <div className="flex flex-col p-2">
        {navigation.map((element, index) => (
          <Link
            key={index}
            href={element.href}
            className={`${
              pathname === element.href ? 'bg-white' : ''
            } flex gap-3 p-3 rounded-md hover:bg-white`}>
            <Image
              src={element.icon}
              alt={`Sidebar ${element.name} icon`}
              width={18}
              height={18}
            />
            <p className="font-normal hidden lg:block">{element.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarAdmin;
