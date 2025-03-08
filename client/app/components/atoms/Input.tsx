import React, { useState, useEffect } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { LucideIcon } from "lucide-react";

interface InputProps {
  label?: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
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
  setValue,
  fetchSuggestions,
  suggestions = [],
  onSelectSuggestion,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (fetchSuggestions) {
      fetchSuggestions(e.target.value);
    }
  };

  const handleSelectSuggestion = (suggestion: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    setInputValue(suggestion.display_name);
    setShowSuggestions(false);
    if (setValue) {
      setValue(name, suggestion.display_name);
    }
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };

  return (
    <div className="relative w-full">
      {label && <label className="text-gray-700 mb-1">{label}</label>}

      <input
        {...register(name, validation)}
        type={type}
        placeholder={placeholder}
        className={`p-[14px] pl-3 pr-10 w-full border border-gray-300 text-gray-800 placeholder:text-black rounded focus:outline-none focus:ring-[2px] focus:ring-primary ${className}`}
        value={inputValue || value}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {Icon && (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          <Icon className="w-[25px] h-[25px] text-gray-800" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 mt-3 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelectSuggestion(suggestion)}
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
