import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { Images, LucideIcon } from "lucide-react";

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  value?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  validation?: object;
  icon?: LucideIcon;
  className?: string;
  error?: string;
  onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  register,
  validation = {},
  icon: Icon,
  className = "",
  error,
  onChange,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "file" && e.target.files) {
      setSelectedFile(e.target.files[0].name);
    }
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-gray-700 font-medium mb-1">{label}</label>
      )}

      <div className="relative w-full">
        {type === "file" ? (
          <div
            className="flex items-center justify-center w-full p-[15px] border border-gray-300 rounded-md cursor-pointer hover:border-primary"
            onClick={handleFileClick}
          >
            <input
              {...register(name, validation)}
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleChange}
            />
            {selectedFile ? (
              <span className="text-gray-700 truncate max-w-[300px]">
                {selectedFile}
              </span>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
            <Images className="w-[18px] h-[18px] text-gray-500 ml-2" />
          </div>
        ) : (
          <input
            {...register(name, validation)}
            defaultValue={value || ""}
            onChange={handleChange}
            type={type}
            placeholder={placeholder}
            className={`p-[14px] pl-3 pr-10 w-full border text-gray-800 placeholder:text-gray-800 rounded-md focus:outline-none focus:ring-[1.4px] focus:ring-primary ${className}`}
          />
        )}

        {Icon && (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            <Icon className="w-[25px] h-[25px] text-gray-800" />
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
