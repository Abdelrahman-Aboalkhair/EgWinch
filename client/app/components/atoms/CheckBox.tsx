import { Controller, Control } from "react-hook-form";
import { AiOutlineCheck } from "react-icons/ai";

interface CheckBoxProps {
  name: string;
  control: Control<any>;
  label?: string;
  defaultValue?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  name,
  control,
  label,
  defaultValue = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => field.onChange(!field.value)}
        >
          <div
            className={`w-[22px] h-[22px] flex items-center justify-center border rounded-md transition-all ${
              field.value ? "bg-primary border-primary" : "border-gray-400"
            }`}
          >
            {field.value && <AiOutlineCheck className="text-white text-lg" />}
          </div>
          {label && <span className="text-gray-700 select-none">{label}</span>}
        </div>
      )}
    />
  );
};

export default CheckBox;
