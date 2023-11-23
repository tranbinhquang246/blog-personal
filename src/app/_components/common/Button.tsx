import React, { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className, children, ...props }: Props) {
  return (
    <button
      className={`inline-flex justify-center items-center border-2 border-black hover:bg-slate-100 rounded-lg disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer transition-all duration-300 ${className}`}
      {...props}>
      {children}
    </button>
  );
}

export default Button;
