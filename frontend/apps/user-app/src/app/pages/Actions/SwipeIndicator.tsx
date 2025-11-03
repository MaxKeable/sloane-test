import React from "react";
import {
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaHandPointDown,
} from "react-icons/fa";

const SwipeIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-[rgba(230,220,203,0.7)] animate-swipe">
      <FaLongArrowAltLeft className="text-base text-[rgba(230,220,203,0.5)]" />
      <FaHandPointDown className="text-base animate-swipe-rotate" />
      <FaLongArrowAltRight className="text-base text-[rgba(230,220,203,0.5)]" />
    </div>
  );
};

export default SwipeIndicator;
