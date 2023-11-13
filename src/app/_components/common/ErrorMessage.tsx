import { ReactNode } from 'react';

type Props = { error?: ReactNode };

const ErrorMessage = ({ error }: Props) => {
  return (
    <>{error && <p className="mt-1 text-red-500 text-xs ml-1">{error}</p>}</>
  );
};

export default ErrorMessage;
