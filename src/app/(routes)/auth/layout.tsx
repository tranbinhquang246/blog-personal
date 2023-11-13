import { getServerSession } from 'next-auth';
import React, { ReactNode } from 'react';

import { options } from '@app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const authLayout = async ({ children }: Props) => {
  const session = await getServerSession(options);
  if (session && session.access_token && session.user) {
    redirect('/');
  }
  return (
    <main
      className={`flex justify-center items-center flex-grow w-full h-full`}>
      {children}
    </main>
  );
};

export default authLayout;
