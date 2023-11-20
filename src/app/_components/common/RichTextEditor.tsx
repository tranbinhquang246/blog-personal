import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

type Props = {
  label?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  classNameLabel?: string;
  classNameEditor?: string;
  onEditorChange?: (option: any) => void;
};

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const RichTextEditor = ({
  className,
  classNameEditor,
  classNameLabel,
  label,
  defaultValue,
  required,
  onEditorChange,
}: Props) => {
  const [value, setValue] = useState(defaultValue || '');
  useEffect(() => {
    onEditorChange && onEditorChange(value);
  }, [value, onEditorChange]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`block leading-5 mb-1 ${classNameLabel} text-sm`}>
          {label}
          {required && <span className="text-danger align-super">*</span>}
        </label>
      )}
      <ReactQuill
        value={value}
        theme="snow"
        onChange={setValue}
        modules={modules}
        className={`${classNameEditor}`}
      />
    </div>
  );
};

export default RichTextEditor;
