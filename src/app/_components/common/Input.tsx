import { InputHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import ErrorMessage from './ErrorMessage';
import { UseFormRegisterReturn } from 'react-hook-form';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  sz?: InputSize;
  label?: string;
  type?: string;
  full?: boolean;
  labelClassName?: string;
  icon?: string;
  error?: ReactNode;
  required?: boolean;
  register?: UseFormRegisterReturn;
};

const Input = ({
  sz = 'md',
  label,
  type = 'text',
  full,
  labelClassName,
  className,
  required,
  error,
  icon,
  register,
  ...props
}: Props) => {
  const errorClasses = error ? '!border-danger' : 'border-neutral-06';

  return (
    <div className="w-full">
      {label && (
        <label
          className={`block leading-5 mb-1 font-secondary ${labelClassName} text-neutral-01`}>
          {label}
          {required && <span className="text-danger align-super">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <Image
            src={icon}
            alt="Icon"
            width={18}
            height={18}
            className="absolute left-3"
          />
        )}

        <input
          type={type}
          className={`rounded-md leading-tight focus:!outline-none focus:!shadow-none focus:border-inherit focus:ring-neutral-07 border placeholder-neutral-07 ${errorClasses} ${className}`}
          {...register}
          {...props}
        />
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

export default Input;
