import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
