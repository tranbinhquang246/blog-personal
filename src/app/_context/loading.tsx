'use client';
import Spinner from '@app/_components/common/Spinner';
import { createContext, useState, ReactNode } from 'react';

export interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  const setIsLoading = (value: boolean) => setLoading(value);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && (
        <div className="top-0 fixed overflow-hidden z-40 h-full bg-slate-100 opacity-50 w-full cursor-none flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export { LoadingContext, LoadingProvider };
