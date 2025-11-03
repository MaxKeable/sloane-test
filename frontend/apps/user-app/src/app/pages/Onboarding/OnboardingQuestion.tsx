import { User } from "../../../types/user";
import Vimeo from "@u-wave/react-vimeo";
import OnboardingAnswer from "./OnboardingAnswer";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { QuestionService } from "../../../services/questionService";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../Dashboard/LoadingSpinner";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

type Props = {
  user: User;
  questionId: string;
  recognitionRef: any;
};

export default function OnboardingQuestion({
  user,
  questionId,
  recognitionRef,
}: Props) {
  const { width } = useWindowDimensions();
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [businessType, setBusinessType] = useState<"product" | "service">(
    "service"
  );
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: question, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.QUESTION.GET_ONE, questionId],
    queryFn: () => QuestionService.getQuestion(questionId),
    enabled: !!questionId,
  });

  // Reset video loading state when questionId changes
  useEffect(() => {
    setIsVideoLoading(true);

    // Set a fallback timeout to hide the loading indicator after 5 seconds
    // in case the Vimeo events don't fire properly
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      setIsVideoLoading(false);
    }, 5000);

    // Clean up timeout on unmount or when questionId changes
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [questionId]);

  const handleVideoReady = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsVideoLoading(false);
  };

  const playerDimensions = {
    height: width >= 1024 ? 500 : width >= 768 ? 350 : 180,
    width: width >= 1024 ? 700 : width >= 768 ? 500 : 350,
  };

  if (isLoading || !question) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full px-4" key={questionId}>
      <div className="flex flex-col lg:flex-row gap-12 w-full mx-auto">
        <div className="flex justify-center items-center h-[200px] w-[300px] md:h-[350px] md:w-[500px] lg:h-[500px] lg:w-[700px] pt-12 md:pt-0 relative">
          {isVideoLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-brand-cream/30 border-t-brand-cream rounded-full animate-spin mb-4"></div>
              <p className="text-brand-cream font-medium text-center px-4">
                Video Loading...
              </p>
            </div>
          )}
          <Vimeo
            video={question?.videoUrl}
            height={playerDimensions.height}
            width={playerDimensions.width}
            autoplay={true}
            controls={true}
            className="h-[200px] w-[300px] md:h-[350px] md:w-[500px] lg:h-[500px] lg:w-[700px] mx-auto"
            onReady={handleVideoReady}
            onPlay={handleVideoReady}
            onPlaying={handleVideoReady}
          />
        </div>

        <div className="w-full md:pt-[32px]">
          <h2 className="text-2xl font-bold text-brand-cream">
            {question?.title}
          </h2>
          <p className="text-brand-cream/80">{question?.description}</p>
          {/* Only show the example button if it's not the welcome question */}
          {question?.position !== 1 && (
            <button
              className="text-brand-cream border border-brand-cream px-4 py-2 rounded-lg text-sm mb-2 mt-4 hover:bg-brand-cream/10 transition-colors flex items-center space-x-2"
              onClick={() => setShowExampleModal(true)}
            >
              <span>See Example Answer</span>
            </button>
          )}
          {question?.position !== 1 && (
            <div className="">
              <OnboardingAnswer
                question={question}
                recognitionRef={recognitionRef}
              />
            </div>
          )}
        </div>
      </div>
      <section className="max-w-5xl mx-auto"></section>

      {/* Example Answer Modal */}
      {showExampleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-new-green rounded-xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto example-modal-scroll"
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-brand-cream">
                Example Answer
              </h2>
              <button
                onClick={() => setShowExampleModal(false)}
                className="p-2 hover:bg-brand-cream/10 rounded-full transition-colors"
              >
                <FaTimes className="text-brand-cream" />
              </button>
            </div>

            <p className="text-brand-cream/80 mb-4">
              If you feel a little stuck, here's an example of one we have
              created for you to give you some inspiration.
            </p>

            <div className="border-b border-brand-cream/20 mb-6"></div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-brand-cream">
                Select Your Business Type
              </h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => setBusinessType("service")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    businessType === "service"
                      ? "bg-brand-cream text-[#4b8052] font-medium"
                      : "bg-brand-cream/10 text-brand-cream hover:bg-brand-cream/20"
                  }`}
                >
                  Service-Based Business
                </button>
                <button
                  onClick={() => setBusinessType("product")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    businessType === "product"
                      ? "bg-brand-cream text-[#4b8052] font-medium"
                      : "bg-brand-cream/10 text-brand-cream hover:bg-brand-cream/20"
                  }`}
                >
                  Product-Based Business
                </button>
              </div>
            </div>

            <div className="bg-brand-cream/10 p-6 rounded-lg">
              {businessType === "service" ? (
                question?.serviceBusinessExample ? (
                  <p className="whitespace-pre-line text-brand-cream">
                    {question.serviceBusinessExample}
                  </p>
                ) : (
                  <p className="text-brand-cream/60">
                    No service business example available.
                  </p>
                )
              ) : question?.productBusinessExample ? (
                <p className="whitespace-pre-line text-brand-cream">
                  {question.productBusinessExample}
                </p>
              ) : (
                <p className="text-brand-cream/60">
                  No product business example available.
                </p>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-brand-cream/20 flex justify-end">
              <button
                onClick={() => setShowExampleModal(false)}
                className="px-4 py-2 rounded-lg bg-brand-cream text-[#4b8052] hover:bg-brand-cream/80 transition-colors"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
