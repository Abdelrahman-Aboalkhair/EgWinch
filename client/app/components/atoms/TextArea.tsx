interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-gray-700 font-medium mb-1">{label}</label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      />
    </div>
  );
};

export default TextArea;
