import React, { useState } from "react";
import { Controller, UseFormSetValue } from "react-hook-form";
import { LucideIcon } from "lucide-react";

interface InputProps {
  label?: string;
  control: any;
  name: string;
  type?: string;
  placeholder?: string;
  validation?: object;
  icon?: LucideIcon;
  className?: string;
  error?: string;
  setValue?: UseFormSetValue<any>;
  fetchSuggestions?: (query: string) => void;
  suggestions?: { display_name: string; lat: string; lon: string }[];
  onSelectSuggestion?: (suggestion: {
    display_name: string;
    lat: string;
    lon: string;
  }) => void;
}

const Input: React.FC<InputProps> = ({
  control,
  label,
  name,
  type = "text",
  placeholder,
  validation = {},
  icon: Icon,
  className = "",
  error,
  setValue,
  fetchSuggestions,
  suggestions = [],
  onSelectSuggestion,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative w-full">
      {label && (
        <label className="text-gray-700 pb-2 font-medium">{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`p-[14px] pl-3 pr-10 w-full border border-gray-300 text-gray-800 placeholder:text-black 
              rounded focus:outline-none focus:ring-[2px] focus:ring-lime-700 ${className}`}
            onChange={(e) => {
              field.onChange(e);
              if (fetchSuggestions) {
                fetchSuggestions(e.target.value);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        )}
      />

      {Icon && (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          <Icon className="w-[22px] h-[22px] text-gray-800" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 mt-4 w-full bg-white shadow-md rounded-lg z-10 p-2 pb-4 max-h-[210px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-[13px] hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setValue(name, suggestion.display_name);
                if (onSelectSuggestion) onSelectSuggestion(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
