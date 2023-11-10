import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

const authLayout = ({ children, className }: Props) => {
  return (
    <div
      className={`flex justify-center items-center fixed w-full h-full ${className}`}>
      {children}
    </div>
  );
};

export default authLayout;
