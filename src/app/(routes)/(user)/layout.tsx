import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const userLayout = async ({ children }: Props) => {
  return (
    <main className={`flex justify-center flex-grow w-full h-full`}>
      {children}
    </main>
  );
};

export default userLayout;
