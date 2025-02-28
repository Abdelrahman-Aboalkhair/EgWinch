import { AiOutlineCheck } from "react-icons/ai";

interface CheckBoxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, onChange }) => {
  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div
        className={`w-[22px] h-[22px] flex items-center justify-center border rounded-md transition-all ${
          checked ? "bg-primary border-primary" : "border-gray-400"
        }`}
      >
        {checked && <AiOutlineCheck className="text-white text-lg" />}
      </div>
      {label && <span className="text-gray-700 select-none">{label}</span>}
    </div>
  );
};

export default CheckBox;
