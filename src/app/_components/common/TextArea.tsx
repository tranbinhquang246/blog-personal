import React, { TextareaHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  label?: string;
  value?: string;
  rows?: number;
  cols?: number;
  error?: string;
  register?: UseFormRegisterReturn;
};

const TextArea = ({
  className,
  label,
  value,
  register,
  error,
  cols = 50,
  rows = 5,
  ...props
}: TextAreaProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className={`block leading-5 mb-1 text-sm`}>{label}</label>
      )}
      <textarea
        className={`rounded-md leading-tight focus:!outline-none focus:!shadow-none focus:border-inherit focus:ring-neutral-07 border placeholder-neutral-07 ${className}`}
        rows={rows}
        cols={cols}
        value={value}
        {...props}
        {...register}></textarea>
      <ErrorMessage error={error} />
    </div>
  );
};

export default TextArea;
