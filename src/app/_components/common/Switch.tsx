import { HTMLAttributes, ReactNode, useCallback, useState } from 'react';
import { Switch } from '@headlessui/react';

import ErrorMessage from './ErrorMessage';

type SwitchSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type SwitchProps = HTMLAttributes<HTMLElement> & {
  checked: boolean;
  readOnly?: boolean;
  label?: string;
  id?: string;
  size?: SwitchSize;
  textSize?: string;
  style?: {
    switch?: string;
    background?: string;
    thumb?: string;
  };
  error?: ReactNode;
  onSwitchChange?: (value: boolean) => void;
};

const SwitchComponent = ({
  checked = false,
  label,
  id,
  size = 'md',
  textSize,
  style,
  error,
  onSwitchChange,
  ...props
}: SwitchProps) => {
  const [enabled, setEnabled] = useState(checked);
  let variantClassNames = {
    background: '',
    thumb: '',
    text: '',
  };

  switch (size) {
    case 'xs':
      variantClassNames.background = '!h-4 !w-7';
      variantClassNames.thumb = '!h-3 !w-3';
      variantClassNames.text = 'text-xs';
      break;
    case 'sm':
      variantClassNames.background = '!h-5 !w-9';
      variantClassNames.thumb = '!h-4 !w-4';
      variantClassNames.text = 'text-sm';
      break;
    case 'md':
      variantClassNames.background = 'h-6 w-11';
      variantClassNames.thumb = 'h-5 w-5';
      variantClassNames.text = 'text-base';
      break;
    case 'lg':
      variantClassNames.background = ' h-7 w-[52px]';
      variantClassNames.thumb = 'h-6 w-6';
      variantClassNames.text = 'text-lg';
      break;
    case 'xl':
      variantClassNames.background = ' h-8 w-[60px]';
      variantClassNames.thumb = 'h-7 w-7';
      variantClassNames.text = 'text-xl';
      break;
    case '2xl':
      variantClassNames.background = ' h-9 w-[68px]';
      variantClassNames.thumb = 'h-8 w-8';
      variantClassNames.text = 'text-2xl';
      break;
  }

  const handleChange = useCallback(
    (value: boolean) => {
      setEnabled(value);
      onSwitchChange && onSwitchChange(value);
    },
    [onSwitchChange]
  );

  return (
    <Switch.Group>
      <div className="flex flex-col gap-1">
        <div className={`flex items-center gap-3 ${style?.switch}`}>
          <Switch
            id={id}
            name={id}
            checked={enabled}
            onChange={(value) => handleChange(value)}
            className={`${enabled ? 'bg-yellow' : 'bg-slate-300'}
          relative inline-flex shrink-0  h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 ${
            variantClassNames.background
          } ${style?.background}`}>
            <span className="sr-only">{label}</span>
            <span
              aria-hidden="true"
              className={`${enabled ? 'translate-x-full' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              variantClassNames.thumb
            } ${style?.thumb}`}
            />
          </Switch>
          <Switch.Label
            htmlFor={id}
            className={`text-base font-normal hover:cursor-pointer ${variantClassNames.text} ${textSize}`}>
            {label}
          </Switch.Label>
        </div>
        <ErrorMessage error={error} />
      </div>
    </Switch.Group>
  );
};

export default SwitchComponent;
