import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaStore,
  FaTools,
  FaLightbulb,
  FaPencilAlt,
  FaExpandAlt,
  FaCompressAlt,
  FaCheck,
} from "react-icons/fa";
import { BusinessModelItem } from "../../../services/businessModelService";
import toast from "react-hot-toast";

// Common toast style matching MindfulnessModal
const commonToastStyle = {
  background: "var(--brand-cream, #Fdf3e3)",
  padding: "16px",
  maxWidth: "90vw",
  width: "auto",
  color: "#4b8052",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
};

interface BusinessModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BusinessModelItem | null;
  onSave: (item: BusinessModelItem, answer: string) => Promise<void>;
}

// Custom scrollbar styles for the modal
const scrollbarStyles = `
  .business-model-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .business-model-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .business-model-scroll::-webkit-scrollbar-thumb {
    background: #FDF3E3; /* brand-cream color */
    opacity: 0.3;
  }
  .business-model-scroll::-webkit-scrollbar-thumb:hover {
    background: #FDF3E3;
    opacity: 0.5;
  }
`;

// Add this CSS for the animated arrow
const arrowAnimation = `
  @keyframes bounceRight {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(5px);
    }
  }
  .animate-bounce-right {
    animation: bounceRight 1s infinite;
  }
`;

const BusinessModelModal: React.FC<BusinessModelModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeExampleTab, setActiveExampleTab] = useState<
    "service" | "product" | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  console.log({ item });
  // Create a memoized resetForm function
  const resetForm = useCallback(() => {
    if (item && item.answer && item.answer.answer) {
      setAnswer(item.answer.answer);
    } else {
      setAnswer("");
    }

    // Set default active tab if examples exist
    if (item?.question.serviceBusinessExample) {
      setActiveExampleTab("service");
    } else if (item?.question.productBusinessExample) {
      setActiveExampleTab("product");
    } else {
      setActiveExampleTab(null);
    }

    // Reset states when modal opens with a new item
    setShowExamples(false);
    setIsExpanded(false);
  }, [item]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleSave = async () => {
    if (!item) return;

    try {
      setIsSubmitting(true);
      await onSave(item, answer);

      // Only show toast for regular business model answers, not for memory items
      if (item?.answer?._id !== "memory-answer-0") {
        // Regular answer toast
        toast(
          (t) => (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 w-full max-w-[500px]">
              <div className="flex items-center gap-4">
                <div className="bg-[#4b8052]/20 p-2 rounded-full">
                  <FaCheck className="text-[#4b8052] text-xl" />
                </div>
                <span className="text-[#4b8052] text-base sm:text-lg flex-1 pr-4 text-center sm:text-left">
                  Answer saved successfully! <br></br>
                  Don't forget to click{" "}
                  <span className="font-bold">
                    "Confirm & Update Business Model"
                  </span>{" "}
                  at the top of the page.
                </span>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-4 py-2 bg-[#4b8052] text-brand-cream rounded-lg hover:bg-[#4b8052]/90 transition-colors mt-2 sm:mt-0 w-full sm:w-auto"
              >
                Okay
              </button>
            </div>
          ),
          {
            position: "top-center",
            duration: 10000,
            style: commonToastStyle,
          }
        );
      }

      onClose();
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("Failed to save answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleUseTemplate = (template: string) => {
    if (answer.trim() !== "") {
      setPendingTemplate(template);
      setShowConfirmation(true);
    } else {
      setAnswer(template);
    }
  };

  const confirmUseTemplate = () => {
    if (pendingTemplate) {
      setAnswer(pendingTemplate);
      setPendingTemplate(null);
      setShowConfirmation(false);
    }
  };

  const cancelUseTemplate = () => {
    setPendingTemplate(null);
    setShowConfirmation(false);
  };

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const hasExamples =
    item?.question.serviceBusinessExample ||
    item?.question.productBusinessExample;

  if (!isOpen || !item) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div
        ref={modalRef}
        className={`bg-new-green border border-brand-cream/20 rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${
          isExpanded
            ? "w-[90vw] h-[90vh] max-w-none"
            : "w-full max-w-4xl max-h-[90vh]"
        }`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-brand-cream/10 flex justify-between items-center relative bg-new-green/80">
          <h2 className="text-2xl font-semibold text-brand-cream w-[90%]">
            {item.question.title}
          </h2>
          <button
            onClick={onClose}
            className="text-brand-cream/70 hover:text-brand-cream transition-colors absolute top-4 right-4"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-grow business-model-scroll">
          <div className="mb-6 bg-brand-cream/5 p-5 rounded-lg border border-brand-cream/20">
            <div className="flex items-center mb-3">
              <FaLightbulb className="mr-2 text-brand-cream" />
              <h3 className="text-lg font-medium text-brand-cream">
                Suggestion
              </h3>
            </div>
            <p className="text-brand-cream/80 pl-6">
              {item.question.description}
            </p>
          </div>

          {/* Example Answers Section */}
          {hasExamples && (
            <div className="mb-6">
              {!showExamples ? (
                <div className="bg-brand-cream/10 p-5 rounded-lg border border-brand-cream/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-brand-cream/90 italic">
                      Need some inspiration? Have a look at example answers for
                      the type of detail to include.
                    </p>
                    <motion.button
                      onClick={toggleExamples}
                      className="flex items-center justify-center px-4 py-2 bg-brand-cream/15 hover:bg-brand-cream/25 text-brand-cream rounded-md transition-colors text-sm border border-brand-cream/20 whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ y: 0 }}
                      animate={{
                        y: [0, -3, 0],
                        transition: {
                          repeat: 2,
                          duration: 1,
                          delay: 0.5,
                          repeatType: "reverse",
                        },
                      }}
                    >
                      <FaLightbulb className="mr-2 text-brand-cream" />
                      View Examples
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-cream/10 p-5 rounded-lg border border-brand-cream/20">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <FaLightbulb
                        className="text-brand-cream mr-2"
                        size={18}
                      />
                      <h3 className="text-lg font-medium text-brand-cream">
                        Example Answers
                      </h3>
                    </div>
                    <button
                      onClick={toggleExamples}
                      className="text-brand-cream/70 hover:text-brand-cream text-sm flex items-center"
                    >
                      <FaTimes className="mr-1" />
                      Hide Examples
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex flex-wrap mb-3 border-b border-brand-cream/20">
                    {item.question.serviceBusinessExample && (
                      <button
                        onClick={() => setActiveExampleTab("service")}
                        className={`flex items-center px-4 py-2 mr-2 rounded-t-lg ${
                          activeExampleTab === "service"
                            ? "bg-brand-cream/15 text-brand-cream border-b-2 border-brand-cream"
                            : "text-brand-cream/60 hover:text-brand-cream hover:bg-brand-cream/5"
                        }`}
                      >
                        <FaTools className="mr-2" />
                        Service Business
                      </button>
                    )}

                    {item.question.productBusinessExample && (
                      <button
                        onClick={() => setActiveExampleTab("product")}
                        className={`flex items-center px-4 py-2 rounded-t-lg ${
                          activeExampleTab === "product"
                            ? "bg-brand-cream/15 text-brand-cream border-b-2 border-brand-cream"
                            : "text-brand-cream/60 hover:text-brand-cream hover:bg-brand-cream/5"
                        }`}
                      >
                        <FaStore className="mr-2" />
                        Product Business
                      </button>
                    )}
                  </div>

                  {/* Tab Content */}
                  <div className="bg-brand-cream/5 p-4 rounded-lg border border-brand-cream/20">
                    {activeExampleTab === "service" &&
                      item.question.serviceBusinessExample && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-brand-cream font-medium">
                              Service Business Example:
                            </h4>
                            <button
                              onClick={() =>
                                handleUseTemplate(
                                  item.question.serviceBusinessExample || ""
                                )
                              }
                              className="text-xs bg-brand-cream/15 hover:bg-brand-cream/25 text-brand-cream px-2 py-1 rounded flex items-center"
                            >
                              <span>Use as Template</span>
                            </button>
                          </div>
                          <p className="text-brand-cream/80 whitespace-pre-wrap">
                            {item.question.serviceBusinessExample}
                          </p>
                        </div>
                      )}

                    {activeExampleTab === "product" &&
                      item.question.productBusinessExample && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-brand-cream font-medium">
                              Product Business Example:
                            </h4>
                            <button
                              onClick={() =>
                                handleUseTemplate(
                                  item.question.productBusinessExample || ""
                                )
                              }
                              className="text-xs bg-brand-cream/15 hover:bg-brand-cream/25 text-brand-cream px-2 py-1 rounded flex items-center"
                            >
                              <span>Use as Template</span>
                            </button>
                          </div>
                          <p className="text-brand-cream/80 whitespace-pre-wrap">
                            {item.question.productBusinessExample}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}

          {item.question.example && (
            <div className="mb-6 bg-brand-cream/5 p-4 rounded-lg border border-brand-cream/10">
              <h3 className="text-lg font-medium text-brand-cream mb-2">
                {item?.answer?._id === "memory-answer-0"
                  ? "Example Memory"
                  : "Example Answer"}
              </h3>
              <p className="text-brand-cream/80 whitespace-pre-wrap">
                {item.question.example}
              </p>
            </div>
          )}

          <div className="mt-6 bg-brand-cream/15 p-5 rounded-lg border border-brand-cream/25">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <FaPencilAlt className="text-brand-cream mr-2" size={18} />
                <h3 className="text-lg font-medium text-brand-cream">
                  {item?.answer?._id === "memory-answer-0"
                    ? "Your Memory"
                    : "Your Answer"}{" "}
                </h3>
              </div>
              <button
                onClick={toggleExpand}
                className="flex items-center text-brand-cream/80 hover:text-brand-cream text-sm bg-brand-cream/10 hover:bg-brand-cream/15 px-3 py-1 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <>
                    <FaCompressAlt className="mr-1.5" size={12} />
                    <span className="hidden sm:inline">Make Smaller</span>
                    <span className="sm:hidden">Smaller</span>
                  </>
                ) : (
                  <>
                    <FaExpandAlt className="mr-1.5" size={12} />
                    <span className="hidden sm:inline">Make Bigger</span>
                    <span className="sm:hidden">Bigger</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`w-full p-4 bg-brand-cream/5 border border-brand-cream/20 rounded-lg text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:ring-2 focus:ring-brand-cream/30 resize-y business-model-scroll transition-all duration-300 ${
                isExpanded ? "min-h-[400px]" : "min-h-[150px]"
              }`}
              placeholder="Type your answer here..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-brand-cream/10 flex justify-end space-x-4 bg-new-green/80 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-brand-cream/20 text-brand-cream hover:bg-brand-cream/10 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-brand-cream text-brand-green-dark font-medium hover:bg-brand-cream/90 transition-colors flex items-center justify-center min-w-[100px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-block h-5 w-5 border-2 border-brand-green-dark/30 border-t-brand-green-dark rounded-full animate-spin"></span>
            ) : item?.answer?._id === "memory-answer-0" ? (
              "Save Memory"
            ) : (
              "Save Answer"
            )}
          </button>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-new-green border border-brand-cream/20 rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-semibold text-brand-cream mb-3">
                Replace Your Answer?
              </h3>
              <p className="text-brand-cream/80 mb-6">
                You already have an answer. Are you sure you want to replace it
                with this example?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelUseTemplate}
                  className="px-4 py-2 rounded-lg border border-brand-cream/20 text-brand-cream hover:bg-brand-cream/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUseTemplate}
                  className="px-4 py-2 rounded-lg bg-brand-cream text-brand-green-dark font-medium hover:bg-brand-cream/90 transition-colors"
                >
                  Replace
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      <style>{scrollbarStyles}</style>
      <style>{arrowAnimation}</style>
    </motion.div>
  );
};

export default BusinessModelModal;
