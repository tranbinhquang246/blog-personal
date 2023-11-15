import { useEffect, useState } from 'react';

type Props = {
  label?: string;
  required?: boolean;
  labelClassName?: string;
  placeholder?: string;
  defaultValue?: string[];
  className?: string;
  onTagOptionChange?: (option: string[]) => void;
};

const TagsInput = ({
  label,
  required,
  labelClassName,
  className,
  defaultValue,
  onTagOptionChange,
  placeholder,
}: Props) => {
  const [tags, setTags] = useState<string[]>(defaultValue || []);

  function handleKeyDown(e: any) {
    if (e.key !== 'Enter') return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = '';
  }

  function removeTag(index: number) {
    setTags(tags.filter((el, i) => i !== index));
  }

  useEffect(() => {
    onTagOptionChange && onTagOptionChange(tags);
  }, [tags]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className={`block leading-5 mb-1 font-secondary ${labelClassName} text-neutral-01`}>
          {label}
          {required && <span className="text-danger align-super">*</span>}
        </label>
      )}
      <div className="border px-5 py-2 rounded-md w-full flex items-center flex-wrap gap-2 font-light text-sm">
        {tags.map((tag, index) => (
          <div
            className="bg-slate-200 inline-block py-1 px-3 rounded-md"
            key={index}>
            <span className="text">{tag}</span>
            <span
              className="h-5 w-5 cursor-pointer ml-2"
              onClick={() => removeTag(index)}>
              &times;
            </span>
          </div>
        ))}
        <input
          onKeyDown={handleKeyDown}
          type="text"
          className="grow py-1 border-none outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TagsInput;
