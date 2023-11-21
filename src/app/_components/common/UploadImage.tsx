import React, { ReactNode, useRef, useState } from 'react';
import Image from 'next/image';
import { DefaultUserBlackIcon, UploadIcon } from 'public/icons';

type Props = {
  url?: string;
  label?: string;
  type?: string;
  labelClassName?: string;
  className?: string;
  icon?: string;
  error?: ReactNode;
  required?: boolean;
  onChange?: (e: any) => void;
};

function ImageUpload({
  url,
  label,
  labelClassName,
  required,
  onChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(null);

  const handleUpload = (e: any) => {
    setImage(e.target.files[0]);
    onChange && onChange(e.target.files[0]);
  };

  const onUploadImage = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`block leading-5 mb-1 ${labelClassName} text-sm`}>
          {label}
          {required && <span className="text-danger align-super">*</span>}
        </label>
      )}
      <div className="flex flex-col gap-2">
        <input
          hidden
          id="inputUpload"
          type="file"
          onChange={handleUpload}
          ref={fileInputRef}
          accept="image/*"
        />
        <div className="relative w-fit">
          {image ? (
            <Image
              className="rounded-full w-32 h-32"
              width={120}
              height={120}
              src={URL.createObjectURL(image)}
              alt="Preview image"
            />
          ) : (
            <Image
              className="rounded-full w-32 h-32"
              width={120}
              height={120}
              src={url || DefaultUserBlackIcon}
              alt="Preview image"
            />
          )}
          <div
            className="absolute top-0 flex justify-center items-center w-full h-full bg-slate-400 bg-opacity-90 rounded-full opacity-0 hover:opacity-100 hover:cursor-pointer transition-all duration-300"
            onClick={onUploadImage}>
            <Image
              width={36}
              height={36}
              src={UploadIcon}
              alt="Preview image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
