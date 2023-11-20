import React, { ReactNode, useState } from 'react';
import Image from 'next/image';

type Props = {
  label?: string;
  type?: string;
  labelClassName?: string;
  className?: string;
  icon?: string;
  error?: ReactNode;
  required?: boolean;
  onChange?: (e: any) => void;
};

function ImageUpload({ label, labelClassName, required, onChange }: Props) {
  const [image, setImage] = useState(null);

  const handleUpload = (e: any) => {
    setImage(e.target.files[0]);
    onChange && onChange(e.target.files[0]);
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
        <input type="file" onChange={handleUpload} />
        {image && (
          <Image
            width={360}
            height={360}
            src={URL.createObjectURL(image)}
            alt="Preview image"
          />
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
