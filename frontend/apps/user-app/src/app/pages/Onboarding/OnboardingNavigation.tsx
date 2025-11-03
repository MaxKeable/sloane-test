import { useSearchParams } from "react-router-dom";
import { Question } from "../../../types/question";
import { User } from "../../../types/user";
import { useEffect } from "react";

type Props = {
  questions: Question[];
  user: User;
  recognitionRef: any;
};

export default function OnboardingNavigation({
  questions,
  user,
  recognitionRef,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("question")) {
      if (user.onboardingProgress === 2) {
        return setSearchParams({ question: questions[0]._id });
      }
      if (
        user.onboardingProgress &&
        user.onboardingProgress > questions.length
      ) {
        return setSearchParams({ question: "complete" });
      }
      const initialQuestionId =
        questions[(user.onboardingProgress || 1) - 1]._id;
      setSearchParams({ question: initialQuestionId });
    }
  }, [questions, searchParams, setSearchParams, user.onboardingProgress]);

  const question = searchParams.get("question");

  const currentIndex = question
    ? questions.findIndex((q) => q._id === question)
    : -1;

  // Allow users to skip questions - remove the progress restriction
  const isNextDisabled = currentIndex >= questions.length - 1;
  const isPreviousDisabled = currentIndex <= 0;

  // Only show Complete Onboarding on the final question
  const isOnboardingComplete = currentIndex === questions.length - 1;

  const onNext = () => {
    if (currentIndex === questions.length - 1) {
      setSearchParams({ question: "complete" });
    } else if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      setSearchParams({ question: nextQuestion._id });
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const onPrevious = () => {
    if (currentIndex > 0) {
      const previousQuestion = questions[currentIndex - 1];
      setSearchParams({ question: previousQuestion._id });
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const onCompleteOnboarding = () => {
    setSearchParams({ question: "complete" });
  };

  const onSkipQuestion = () => {
    // Same as next, but with different UX messaging
    onNext();
  };

  return (
    <div className="flex justify-between items-center px-4 pt-4 md:pt-0">
      <button
        disabled={isPreviousDisabled}
        onClick={onPrevious}
        className="px-6 py-2 rounded-lg bg-brand-cream text-[#4b8052] font-medium
          transition-all duration-200
          hover:bg-brand-cream/90 hover:shadow-lg hover:-translate-y-[1px]
          active:translate-y-0 active:shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none
          disabled:hover:bg-brand-cream"
      >
        Previous
      </button>

      <div className="flex gap-3">
        {isOnboardingComplete ? (
          <button
            onClick={onCompleteOnboarding}
            className="px-6 py-2 rounded-lg bg-brand-cream text-[#4b8052] font-medium
              transition-all duration-200
              hover:bg-brand-cream/90 hover:shadow-lg hover:-translate-y-[1px]
              active:translate-y-0 active:shadow-md"
          >
            Complete Onboarding
          </button>
        ) : (
          <>
            <button
              onClick={onCompleteOnboarding}
              className="px-4 py-2 rounded-lg border border-brand-cream/60 text-brand-cream/90 font-medium text-sm
                transition-all duration-200
                hover:border-brand-cream hover:text-brand-cream hover:bg-brand-cream/10
                active:translate-y-0"
              title="Finish onboarding now with current answers"
            >
              Finish Early
            </button>
            <button
              onClick={onSkipQuestion}
              className="px-4 py-2 rounded-lg border border-brand-cream/50 text-brand-cream/80 font-medium
                transition-all duration-200
                hover:border-brand-cream hover:text-brand-cream hover:bg-brand-cream/10
                active:translate-y-0"
            >
              Skip Question
            </button>
            <button
              disabled={isNextDisabled}
              onClick={onNext}
              className="px-6 py-2 rounded-lg bg-brand-cream/80 text-[#4b8052] font-medium
                transition-all duration-200
                hover:bg-brand-cream hover:shadow-lg hover:-translate-y-[1px]
                active:translate-y-0 active:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none
                disabled:hover:bg-brand-cream"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
