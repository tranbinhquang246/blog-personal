import { ReactNode } from 'react';

type Props = { error?: ReactNode };

const ErrorMessage = ({ error }: Props) => {
  return (
    <>{error && <p className="mt-2 text-danger text-sm ml-1">{error}</p>}</>
  );
};

export default ErrorMessage;
