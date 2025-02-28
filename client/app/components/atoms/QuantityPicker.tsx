interface QuantityPickerProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const QuantityPicker: React.FC<QuantityPickerProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 99,
}) => {
  return (
    <div className="flex flex-col items-start">
      {label && (
        <label className="text-gray-700 font-medium mb-1">{label}</label>
      )}
      <div className="relative w-[120px]">
        <input
          type="number"
          className="w-full border rounded-md py-2 pr-6 pl-2 text-center appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
          value={value}
          onChange={(e) => {
            const newValue = Math.min(
              Math.max(Number(e.target.value), min),
              max
            );
            onChange(newValue);
          }}
        />
      </div>
    </div>
  );
};

export default QuantityPicker;
