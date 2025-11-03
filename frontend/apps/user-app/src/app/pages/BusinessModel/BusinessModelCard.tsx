import React from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { BusinessModelItem } from "../../../services/businessModelService";

interface BusinessModelCardProps {
  item: BusinessModelItem;
  onClick: (item: BusinessModelItem) => void;
}

const BusinessModelCard: React.FC<BusinessModelCardProps> = ({
  item,
  onClick,
}) => {
  const hasAnswer =
    item.answer && item.answer.answer && item.answer.answer.trim() !== "";

  return (
    <motion.div
      className="bg-brand-cream/10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden cursor-pointer border border-brand-cream/20 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      onClick={() => onClick(item)}
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        y: -5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30,
        },
      }}
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold text-brand-cream">
            {item.question.title}
          </h2>
          <div className="ml-2 flex-shrink-0">
            {hasAnswer ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FaCheck className="mr-1" />{" "}
                {item?.answer?._id === "memory-answer-0"
                  ? "Memory"
                  : "Answered"}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {item?.answer?._id === "memory-answer-0"
                  ? "No Memory"
                  : "No Answer"}
              </span>
            )}
          </div>
        </div>

        <div className="h-28 overflow-hidden mb-2">
          {hasAnswer ? (
            <p className="text-brand-cream/90 line-clamp-4">
              {item.answer?.answer}
            </p>
          ) : (
            <p className="text-brand-cream/50 italic">
              {item?.answer?._id === "memory-answer-0"
                ? "No memory found"
                : "No answer provided yet. Click to add your answer."}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-brand-cream/5 border-t border-brand-cream/10 mt-auto">
        <div className="flex justify-center items-center">
          <button className="flex items-center text-brand-cream/80 hover:text-brand-cream transition-colors text-sm font-medium">
            {hasAnswer
              ? item?.answer?._id === "memory-answer-0"
                ? "View or Edit Memory"
                : "View or Edit Answer"
              : item?.answer?._id === "memory-answer-0"
                ? "Add Your Memory"
                : "Add Your Answer"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessModelCard;
