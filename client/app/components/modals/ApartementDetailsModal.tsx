import { motion } from "framer-motion";
import Dropdown from "../custom/Dropdown";
import { useEffect, useRef, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApartmentDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const [additionalServicesOptions, setAdditionalServicesOptions] = useState<
    string[]
  >(["Option 1", "Option 2", "Option 3"]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <motion.div
        ref={modalRef}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white p-6 rounded-lg shadow-xl w-[30%] flex flex-col items-start justify-start gap-2"
      >
        <h2 className="text-xl font-semibold mb-4">Apartment Details</h2>
        <Dropdown
          className="w-full"
          key={"additionalServices"}
          options={additionalServicesOptions}
          label="Additional Services"
          onClear={() => setAdditionalServicesOptions([])}
          onSelect={setAdditionalServicesOptions}
        />
        <Dropdown
          className="w-full"
          key={"bedroomsNumber"}
          options={additionalServicesOptions}
          label="Additional Services"
          onClear={() => setAdditionalServicesOptions([])}
          onSelect={setAdditionalServicesOptions}
        />

        <div className="flex items-center justify-self-center gap-2 w-full">
          <button
            type="submit"
            className="mt-4 w-full py-[12px] rounded-sm bg-primary hover:opacity-90 active:scale-95 text-white font-medium"
          >
            Create booking
          </button>
          <button
            onClick={onClose}
            className="w-full py-[12px] mt-4 bg-red-800 text-white rounded hover:opacity-90"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ApartmentDetailsModal;
