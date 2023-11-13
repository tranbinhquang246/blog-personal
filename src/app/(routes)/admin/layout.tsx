import { getServerSession } from 'next-auth';
import React, { ReactNode } from 'react';

import { options } from '@app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { RoleTypes } from '@app/_constants/enums';
import SidebarAdmin from '@app/_components/admin/Sidebar';

type Props = {
  children: ReactNode;
};

const adminLayout = async ({ children }: Props) => {
  const session = await getServerSession(options);
  if (
    session &&
    session.access_token &&
    session.user.role !== RoleTypes.ADMIN
  ) {
    redirect('/');
  }
  return (
    <div className={`relative flex justify-center flex-grow w-full h-full`}>
      <aside className="flex w-16 lg:w-64 absolute h-full left-0 bg-lightgrey transition-all duration-300">
        <SidebarAdmin />
      </aside>
      <main className="flex justify-center flex-grow h-full ml-16 lg:ml-64">
        {children}
      </main>
    </div>
  );
};

export default adminLayout;
