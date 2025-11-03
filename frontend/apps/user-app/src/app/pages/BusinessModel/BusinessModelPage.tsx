import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  BusinessModelService,
  BusinessModelItem,
} from "../../../services/businessModelService";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import LoadingSpinner from "../Dashboard/LoadingSpinner";
import { AnimatePresence } from "framer-motion";
import { FaClock, FaArrowRight } from "react-icons/fa";
import { format } from "date-fns";
import BusinessModelCard from "./BusinessModelCard";
import BusinessModelModal from "./BusinessModelModal";
import { AnswerService } from "../../../services/answerService";
import toast from "react-hot-toast";
import PageWrapper from "@/app/components/core/page-wrapper";

// Add CSS for the animated arrow
const arrowAnimation = `
  @keyframes bounceRight {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(8px);
    }
  }
  @keyframes bounceUp {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  .animate-arrow-right {
    animation: bounceRight 1.5s infinite;
  }
  .animate-arrow-up {
    animation: bounceUp 1.5s infinite;
  }
`;

export default function BusinessModelPage() {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<BusinessModelItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_MODEL],
    queryFn: BusinessModelService.getBusinessModel,
  });

  const { mutate: completeOnboarding, isPending: isUpdatingBusinessModel } =
    useMutation({
      mutationFn: AnswerService.completeOnboarding,
      onSuccess: () => {
        toast.success("Business model updated successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#FDF3E3",
            color: "#003b1f",
            padding: "12px 16px",
            fontSize: "14px",
          },
        });
      },
      onError: () => {
        toast.error("Failed to update business model", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#FDF3E3",
            color: "#003b1f",
            padding: "12px 16px",
            fontSize: "14px",
          },
        });
      },
    });

  const { mutate: updateAnswer } = useMutation({
    mutationFn: ({ answerId, answer }: { answerId: string; answer: string }) =>
      BusinessModelService.updateAnswer(answerId, answer),
    onSuccess: (response, variables) => {
      console.log("Update response:", response);

      // Update the selected item with the new answer text
      if (selectedItem && selectedItem.answer) {
        setSelectedItem({
          ...selectedItem,
          answer: {
            ...selectedItem.answer,
            answer: variables.answer,
            updatedAt: response.answer?.updatedAt || new Date().toISOString(),
          },
        });
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BUSINESS_MODEL],
      });
      setIsSaving(false);
    },
    onError: () => {
      toast.error("Failed to update answer", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          padding: "12px 16px",
          fontSize: "14px",
        },
      });
      setIsSaving(false);
    },
  });

  const { mutate: createAnswer } = useMutation({
    mutationFn: ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: string;
    }) => BusinessModelService.createAnswer(questionId, answer),
    onSuccess: (response, variables) => {
      console.log("Create response:", response);
      toast.success("Answer created successfully", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          padding: "12px 16px",
          fontSize: "14px",
        },
      });

      // Update the selected item with the new answer
      if (selectedItem) {
        setSelectedItem({
          ...selectedItem,
          answer: {
            _id: response.answer._id,
            answer: variables.answer,
            createdAt: response.answer?.createdAt || new Date().toISOString(),
            updatedAt: response.answer?.updatedAt || new Date().toISOString(),
          },
        });
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BUSINESS_MODEL],
      });
      setIsSaving(false);
    },
    onError: () => {
      toast.error("Failed to create answer", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          padding: "12px 16px",
          fontSize: "14px",
        },
      });
      setIsSaving(false);
    },
  });

  const handleCardClick = (item: BusinessModelItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return; // Prevent closing while saving
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveAnswer = async (item: BusinessModelItem, answer: string) => {
    if (isSaving) return;

    setIsSaving(true);

    // Handle business model items
    if (item.answer) {
      updateAnswer({ answerId: item.answer._id, answer });
    } else {
      createAnswer({ questionId: item.question._id, answer });
    }
  };

  // Find the most recent answer update time
  const getLastUpdateTime = () => {
    if (!data?.businessModel || data.businessModel.length === 0) return null;

    // Find the most recent answer if available
    const answeredItems = data.businessModel.filter((item) => item.answer);
    if (answeredItems.length === 0) return null;

    // For now, we'll just return the current date as a placeholder
    // This will be replaced with actual timestamps from the database in the future
    return new Date();
  };

  const lastUpdateTime = getLastUpdateTime();

  // Filter out the first welcome question (assuming it's at position 1)
  const combinedBusinessModel =
    data?.businessModel.filter((item) => item.question.position !== 1) || [];

  // Update card content when data changes
  useEffect(() => {
    if (selectedItem && isModalOpen && data) {
      // Find the updated item in the data
      const updatedItem = data.businessModel.find(
        (item) => item.question._id === selectedItem.question._id
      );

      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    }
  }, [data, selectedItem, isModalOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-brand-cream text-xl">
          Error loading business model
        </div>
      </div>
    );
  }

  return (
    <PageWrapper title="Your Business Model">
      <div className="flex">
        <div className="flex-1">
          <div className="pb-12 px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
              <div className="text-center mb-8">
                <p className="text-brand-cream/80 max-w-xl sm:max-w-2xl mx-auto">
                  Review and update your business model answers at any time.
                  These answers help us understand your business better and
                  provide more personalized recommendations.
                </p>

                {lastUpdateTime && (
                  <div className="flex items-center justify-center mt-4 text-brand-cream/70">
                    <FaClock className="mr-2" />
                    <span>
                      Last updated: {format(lastUpdateTime, "MMMM d, yyyy")}
                    </span>
                  </div>
                )}

                <div className="mt-6 flex justify-center items-center relative">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {/* Desktop layout - text and arrow on left */}
                      <div className="absolute -left-48 top-1/2 -translate-y-1/2 items-center hidden lg:flex">
                        <div className="text-right mr-2">
                          <p className="text-brand-cream text-sm font-bold uppercase">
                            Click this button
                          </p>
                          <p className="text-brand-cream/70 text-xs">
                            after making changes
                          </p>
                        </div>
                        <div className="animate-arrow-right text-brand-cream">
                          <FaArrowRight size={20} />
                        </div>
                      </div>
                      <button
                        onClick={() => completeOnboarding({})}
                        className="bg-brand-cream text-brand-green px-6 py-2 rounded-md hover:scale-105 transition-all duration-300 flex items-center justify-center"
                        disabled={isUpdatingBusinessModel}
                      >
                        {isUpdatingBusinessModel
                          ? "Updating business model..."
                          : "Confirm & Update Business Model"}
                      </button>

                      {/* Mobile/tablet layout - text and arrow below */}
                      <div className="flex flex-col items-center mt-3 lg:hidden">
                        <div className="animate-arrow-up text-brand-cream mb-2">
                          <FaArrowRight
                            className="transform -rotate-90"
                            size={20}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-brand-cream text-sm font-bold uppercase">
                            Click this button
                          </p>
                          <p className="text-brand-cream/70 text-xs">
                            after making changes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {combinedBusinessModel?.map((item) => (
                  <BusinessModelCard
                    key={item.question._id}
                    item={item}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <BusinessModelModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              item={selectedItem}
              onSave={handleSaveAnswer}
            />
          )}
        </AnimatePresence>
        <style>{arrowAnimation}</style>
      </div>
    </PageWrapper>
  );
}
