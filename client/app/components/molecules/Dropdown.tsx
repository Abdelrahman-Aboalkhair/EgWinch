import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label?: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = options?.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue); // Updates form state
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full p-[14px] border border-gray-300 rounded-md cursor-pointer hover:border-primary"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-base">{value || label}</span>

        <div className="flex items-center">
          {value ? (
            <AiOutlineClose
              className="text-gray-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            />
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronDown className="text-gray-600 ml-2" />
            </motion.div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg z-10">
          <motion.ul
            className="max-h-56 overflow-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredOptions.length === 0 ? (
              <li className="p-2 text-gray-500">No options found</li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))
            )}
          </motion.ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
