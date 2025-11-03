import React from "react";
// import logo from "../../../Images/logo.png";
import logo from "../../components/Images/logo.png";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-logo"></div>
        <img
          src={logo}
          alt="Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 object-contain"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
