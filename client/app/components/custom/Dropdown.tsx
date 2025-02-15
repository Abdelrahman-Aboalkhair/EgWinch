import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label?: string;
  options: string[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  onSelect,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = options?.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
  };

  // Close the dropdown if clicked outside
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full py-[15px] px-2 border rounded-md cursor-pointer hover:border-primary"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-gray-700">
          {selectedOption ? selectedOption : label}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {selectedOption ? (
            <AiOutlineClose
              className="text-gray-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOption(null);
                onClear();
              }}
            />
          ) : (
            <ChevronDown className="text-gray-600 ml-2" />
          )}
        </motion.div>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg z-10">
          {/* Search bar */}
          <input
            type="text"
            className="w-full p-2 border-b focus:outline-none focus:border-primary"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* List of filtered options */}
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
