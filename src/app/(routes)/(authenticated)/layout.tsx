import { getServerSession } from 'next-auth';
import React, { ReactNode } from 'react';

import { options } from '@app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { RoleTypes } from '@app/_constants/enums';
import SidebarAdmin from '@app/_components/admin/Sidebar';

type Props = {
  children: ReactNode;
};

const authenticatedLayout = async ({ children }: Props) => {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/');
  }

  return (
    <main className={`flex justify-center flex-grow w-full h-full`}>
      {children}
    </main>
  );
};

export default authenticatedLayout;
