import React from "react";

interface ButtonProps {
  title: string;
  handleClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ title, className, handleClick }) => {
  const handleButtonClick = () => {
    if (handleClick) {
      handleClick(); // Trigger the passed handleClick function
    }
  };

  return (
    <div
      className={`relative bg-brand-white border-2 border-brand-green w-[250px] h-auto text-center rounded-full shadow-lg text-brand-green flex flex-col justify-center items-center ${className} hover:bg-brand-cream hover:text-brand-green hover:shadow-2xl hover:border-2 active:border-3 active:border-brand-orange active:underline active:cursor-pointer px-8 md:px-4`}
      onClick={handleButtonClick}
    >
      <h3 className="text-[20px] hover:cursor-pointer">{title}</h3>
    </div>
  );
};

export default Button;
