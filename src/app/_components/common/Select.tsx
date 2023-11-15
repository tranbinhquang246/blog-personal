import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import Image from 'next/image';
import { DownIcon } from 'public/icons';
import { OptionType } from '@app/_interfaces';

type Props = {
  label?: string;
  defaultOption?: OptionType;
  placeholder?: string;
  data: OptionType[];
  required?: boolean;
  labelClassName?: string;
  className?: string;
  onSelectedOptionChange?: (option: OptionType) => void;
};

const Select = ({
  label,
  data,
  defaultOption,
  placeholder,
  required,
  labelClassName,
  className,
  onSelectedOptionChange,
}: Props) => {
  const [selected, setSelected] = useState<OptionType>();

  useEffect(() => {
    if (defaultOption) {
      setSelected(defaultOption);
      return;
    }
    setSelected(undefined);
  }, [defaultOption]);

  const handleOptionClick = useCallback(
    (option: OptionType) => {
      onSelectedOptionChange && onSelectedOptionChange(option);
      setSelected(option);
    },
    [onSelectedOptionChange]
  );

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
        <Listbox value={selected} onChange={setSelected}>
          {({ open }) => (
            <>
              <div className={`relative mt-1 ${className}`}>
                <Listbox.Button className="relative w-full h-full cursor-default rounded-lg bg-white pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm hover:cursor-pointer">
                  <span className="block truncate">
                    {selected?.label || placeholder || ''}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Image
                      src={DownIcon}
                      alt="Select down icon"
                      width={18}
                      height={18}
                      className={`${open ? 'rotate-180' : ''}`}
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                    {data.map((item, index) => {
                      const isActive = item.value === selected?.value;
                      return (
                        <Listbox.Option
                          key={index}
                          className={() =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              isActive
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-900 hover:bg-lightgrey '
                            }`
                          }
                          value={item}
                          onClick={() => handleOptionClick(item)}>
                          {() => (
                            <>
                              <span
                                className={`block truncate ${
                                  isActive ? 'font-medium' : 'font-normal'
                                }`}>
                                {item.label}
                              </span>
                              {isActive ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  x
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default Select;
