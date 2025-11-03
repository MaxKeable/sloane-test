import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { FaClock } from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  BusinessModelItem,
  BusinessModelService,
} from "../../../../services/businessModelService";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { AnswerService } from "../../../../services/answerService";
import LoadingSpinner from "../../Dashboard/LoadingSpinner";
import { BusinessModelCard, BusinessModelModal } from "../../BusinessModel";
import { useParams, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import WestIcon from "@mui/icons-material/West";

export default function AdminBusinessModelPage() {
  // get the user id from the url

  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<BusinessModelItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const { userId } = useParams();
  const name = searchParams.get("name");
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_MODEL, userId],
    queryFn: () => BusinessModelService.adminGetBusinessModel(userId as string),
  });

  // Clerk user ID for back button (from query string only)

  const { mutate: completeOnboarding, isPending: isUpdatingBusinessModel } =
    useMutation({
      mutationFn: AnswerService.completeOnboarding,
      onSuccess: () => {
        toast.success("Business model updated successfully", {
          position: "top-center",
        });
      },
      onError: () => {
        toast.error("Failed to update business model", {
          position: "top-center",
        });
      },
    });

  const { mutate: updateAnswer } = useMutation({
    mutationFn: ({ answerId, answer }: { answerId: string; answer: string }) =>
      BusinessModelService.updateAnswer(answerId, answer),
    onSuccess: (response, variables) => {
      console.log("Update response:", response);
      toast.success("Answer updated successfully", { position: "top-center" });

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
      toast.error("Failed to update answer", { position: "top-center" });
      setIsSaving(false);
    },
  });

  const { mutate: createAnswer } = useMutation({
    mutationFn: ({
      questionId,
      answer,
      userId,
    }: {
      questionId: string;
      answer: string;
      userId?: string;
    }) => BusinessModelService.createAnswer(questionId, answer, userId),
    onSuccess: (response, variables) => {
      console.log("Create response:", response);
      toast.success("Answer created successfully", { position: "top-center" });

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
      toast.error("Failed to create answer", { position: "top-center" });
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

    if (item.answer) {
      updateAnswer({ answerId: item.answer._id, answer });
    } else {
      createAnswer({ questionId: item.question._id, answer, userId });
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
  const filteredBusinessModel = data?.businessModel.filter(
    (item) => item.question.position !== 1
  );

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
      <div className="min-h-screen bg-new-green flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-brand-green flex items-center justify-center">
        <div className="text-center text-brand-cream text-xl">
          Error loading business model
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-new-green pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Admin Back Buttons */}
        {user?.publicMetadata?.account === "admin" && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <button
              className="px-6 py-2 rounded-full bg-transparent border border-brand-cream/80 text-brand-cream/80 text-base font-semibold hover:bg-brand-cream/10 transition-all duration-200 flex items-center"
              onClick={() => (window.location.href = "/allUsers")}
            >
              <WestIcon className="text-brand-cream/80 mr-2" />
              Back to All Users
            </button>
            {userId && (
              <button
                className="px-6 py-2 rounded-full bg-transparent border border-brand-cream/80 text-brand-cream/80 text-base font-semibold hover:bg-brand-cream/10 transition-all duration-200 flex items-center"
                onClick={() => window.history.back()}
              >
                <WestIcon className="text-brand-cream/80 mr-2" />
                Back to Update User
              </button>
            )}
          </div>
        )}
        <h1 className="text-4xl font-bold mb-2 text-center text-brand-cream">
          {name ?? "No ones"}'s Business Model
        </h1>

        <div className="flex items-center justify-center mb-8">
          <div className="h-1 w-24 bg-brand-cream/60 rounded-full"></div>
        </div>

        <div className="text-center mb-8">
          <p className="text-brand-cream/80 max-w-2xl mx-auto">
            Review and update your business model answers at any time. These
            answers help us understand your business better and provide more
            personalized recommendations.
          </p>

          {lastUpdateTime && (
            <div className="flex items-center justify-center mt-4 text-brand-cream/70">
              <FaClock className="mr-2" />
              <span>
                Last updated: {format(lastUpdateTime, "MMMM d, yyyy")}
              </span>
            </div>
          )}
        </div>
        <div className="py-4 flex justify-end">
          <button
            onClick={() => completeOnboarding({ userId })}
            className="bg-brand-cream text-brand-green px-4 py-2 rounded-md hover:scale-105 transition-all duration-300"
          >
            {isUpdatingBusinessModel
              ? "Updating business model..."
              : "Confirm & update business model"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredBusinessModel?.map((item) => (
            <BusinessModelCard
              key={item.question._id}
              item={item}
              onClick={handleCardClick}
            />
          ))}
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
    </div>
  );
}
