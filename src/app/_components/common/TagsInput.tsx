import { OptionType } from '@app/_interfaces';
import { useEffect, useRef, useState } from 'react';
import ErrorMessage from './ErrorMessage';

type Props = {
  label?: string;
  options?: OptionType[];
  required?: boolean;
  labelClassName?: string;
  placeholder?: string;
  defaultValue?: OptionType[];
  className?: string;
  error?: string;
  onTagOptionChange?: (option: OptionType[]) => void;
};

const TagsInput = ({
  label,
  options,
  required,
  labelClassName,
  className,
  defaultValue,
  error,
  onTagOptionChange,
  placeholder,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<OptionType[]>(defaultValue || []);
  const [optionTags, setOptionTag] = useState<OptionType[]>(options || []);
  const [filteredTags, setFilteredTag] = useState<OptionType[]>([]);

  useEffect(() => {
    const dataSet = new Set(defaultValue?.map((d) => d.value));
    const remainingOptions = options?.filter((o) => !dataSet.has(o.value));
    remainingOptions && setOptionTag(remainingOptions);
  }, [defaultValue, options]);

  const handleKeyDown = (e: any) => {
    if (e.key !== 'Enter') return;
    const value = e.target.value;
    if (!value.trim()) return;
    if (!optionTags?.some((item) => item.label === value)) return;
    const selectedTag = optionTags.find((item) => item.label === value);
    if (selectedTag) {
      setTags([...tags, selectedTag]);
    }
    setOptionTag(
      optionTags.filter((item) => {
        return item.label !== value;
      })
    );
    setFilteredTag([]);
    e.target.value = '';
  };

  const removeTag = (index: number, option: OptionType) => {
    setTags(tags.filter((el, i) => i !== index));
    setOptionTag([...optionTags, option]);
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (!value) {
      setFilteredTag([]);
      return;
    }
    const filtered = optionTags.filter((item) => {
      return item.label.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredTag(filtered);
  };

  const handleSelectedOption = (option: OptionType) => {
    setTags([...tags, option]);
    setOptionTag(
      optionTags.filter((item) => {
        return item.label !== option.label;
      })
    );
    setFilteredTag([]);
    inputRef.current !== null ? (inputRef.current.value = '') : null;
  };

  useEffect(() => {
    onTagOptionChange && onTagOptionChange(tags);
  }, [tags]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`block leading-5 mb-1 ${labelClassName} text-sm`}>
          {label}
          {required && <span className="text-danger align-super">*</span>}
        </label>
      )}
      <div className="border px-5 py-2 rounded-md w-full flex items-center flex-wrap gap-2 font-light text-sm">
        {tags.map((tag, index) => (
          <div
            className="bg-slate-200 inline-block py-1 px-3 rounded-md"
            key={index}>
            <span className="text">{tag.label}</span>
            <span
              className="h-5 w-5 cursor-pointer ml-2"
              onClick={() => removeTag(index, tag)}>
              &times;
            </span>
          </div>
        ))}
        <div className="relative flex grow">
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            type="text"
            className="grow py-1 border-none outline-none"
            placeholder={placeholder}
            onChange={handleChange}
          />
          <div className="absolute bg-lightgrey top-8 z-10 rounded-md flex flex-col">
            {filteredTags.map((element, index) => (
              <p
                key={index}
                className="hover:font-medium hover:cursor-pointer hover:bg-white px-3 py-2 rounded-sm"
                onClick={() => handleSelectedOption(element)}>
                {element.label}
              </p>
            ))}
          </div>
        </div>
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

export default TagsInput;
