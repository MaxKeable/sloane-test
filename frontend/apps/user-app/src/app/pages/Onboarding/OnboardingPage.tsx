import { useCheckOnboarding } from "../../../hooks/useCheckOnboarding";
import { useQuery } from "@tanstack/react-query";
import { QuestionService } from "../../../services/questionService";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import OnboardingNavigation from "./OnboardingNavigation";
import { useSearchParams } from "react-router-dom";
import OnboardingQuestion from "./OnboardingQuestion";
import OnboardingComplete from "./OnboardingComplete";
import LoadingSpinner from "../Dashboard/LoadingSpinner";
import OnboardingSteps from "./OnboardingSteps";
import { useRef } from "react";

export default function OnboardingPage() {
  const { user } = useCheckOnboarding();
  const [searchParams, setSearchParams] = useSearchParams();
  const questionId = searchParams.get("question");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { data: questions } = useQuery({
    queryKey: [QUERY_KEYS.QUESTION.GET_ALL],
    queryFn: QuestionService.getQuestions,
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#4b8052]  relative py-12">
      {questionId === "complete" ? (
        <>
          <OnboardingSteps isComplete={true} />
          <OnboardingComplete />
        </>
      ) : (
        <>
          <OnboardingSteps />
          {!questions || !user ? (
            <LoadingSpinner />
          ) : (
            <div className="w-full">
              {/* Desktop version - single row */}
              <div className="hidden lg:flex flex-col gap-4 mt-12 -mb-4">
                <div className="flex items-center justify-center">
                  {questions.map((question) => (
                    <div
                      key={question._id}
                      className="flex items-center justify-center shrink-0"
                    >
                      {question.position === 1 ? (
                        <button
                          className={`
                          rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm transition-all whitespace-nowrap
                          ${
                            questionId === question._id
                              ? "bg-brand-cream text-new-green"
                              : question.position <=
                                  (user.onboardingProgress || 0)
                                ? "text-brand-cream bg-brand-cream/20"
                                : "text-brand-cream"
                          }
                          ${
                            user.onboardingProgress === undefined ||
                            question.position > user.onboardingProgress
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:bg-brand-cream/20"
                          }
                        `}
                          onClick={() =>
                            setSearchParams({ question: question._id })
                          }
                          disabled={
                            user.onboardingProgress === undefined ||
                            question.position > user.onboardingProgress
                          }
                        >
                          Welcome
                        </button>
                      ) : (
                        <button
                          className={`
                          flex items-center justify-center rounded-full transition-all shrink-0
                          ${
                            questionId === question._id
                              ? "w-3 h-3 sm:w-4 sm:h-4 bg-brand-cream"
                              : question.position <=
                                  (user.onboardingProgress || 1)
                                ? "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-cream"
                                : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-cream/35"
                          }
                          ${
                            user.onboardingProgress === undefined ||
                            question.position > user.onboardingProgress
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:bg-brand-cream/70"
                          }
                        `}
                          onClick={() =>
                            setSearchParams({ question: question._id })
                          }
                          disabled={
                            user.onboardingProgress === undefined ||
                            question.position > user.onboardingProgress
                          }
                        >
                          {questionId === question._id && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-green rounded-full" />
                          )}
                        </button>
                      )}
                      {question.position < questions.length && (
                        <div
                          className={`w-4 sm:w-6 md:w-8 h-[1px] sm:h-[2px] mx-1 sm:mx-2 ${
                            question.position < (user.onboardingProgress || 1)
                              ? "bg-brand-cream"
                              : "bg-brand-cream/10"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet version - two rows */}
              <div className="lg:hidden flex flex-col gap-4 mt-16">
                <div className="flex items-center justify-center">
                  {questions
                    .slice(0, Math.ceil(questions.length / 2))
                    .map((question) => (
                      <div
                        key={question._id}
                        className="flex items-center justify-center shrink-0"
                      >
                        {question.position === 1 ? (
                          <button
                            className={`
                            rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm transition-all whitespace-nowrap
                            ${
                              questionId === question._id
                                ? "bg-brand-cream text-new-green"
                                : question.position <=
                                    (user.onboardingProgress || 0)
                                  ? "text-brand-cream bg-brand-cream/20"
                                  : "text-brand-cream"
                            }
                            ${
                              user.onboardingProgress === undefined ||
                              question.position > user.onboardingProgress
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:bg-brand-cream/20"
                            }
                          `}
                            onClick={() =>
                              setSearchParams({ question: question._id })
                            }
                            disabled={
                              user.onboardingProgress === undefined ||
                              question.position > user.onboardingProgress
                            }
                          >
                            Welcome
                          </button>
                        ) : (
                          <button
                            className={`
                            flex items-center justify-center rounded-full transition-all shrink-0
                            ${
                              questionId === question._id
                                ? "w-3 h-3 sm:w-4 sm:h-4 bg-brand-cream"
                                : question.position <=
                                    (user.onboardingProgress || 1)
                                  ? "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-cream"
                                  : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-cream/35"
                            }
                            ${
                              user.onboardingProgress === undefined ||
                              question.position > user.onboardingProgress
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:bg-brand-cream/70"
                            }
                          `}
                            onClick={() =>
                              setSearchParams({ question: question._id })
                            }
                            disabled={
                              user.onboardingProgress === undefined ||
                              question.position > user.onboardingProgress
                            }
                          >
                            {questionId === question._id && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-green rounded-full" />
                            )}
                          </button>
                        )}
                        {question.position <
                          Math.ceil(questions.length / 2) && (
                          <div
                            className={`w-4 sm:w-6 md:w-8 h-[1px] sm:h-[2px] mx-1 sm:mx-2 ${
                              question.position < (user.onboardingProgress || 1)
                                ? "bg-brand-cream"
                                : "bg-brand-cream/10"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                </div>
                <div className="flex items-center justify-center">
                  {questions
                    .slice(Math.ceil(questions.length / 2))
                    .map((question, index) => (
                      <div
                        key={question._id}
                        className="flex items-center justify-center shrink-0"
                      >
                        <button
                          className={`
                          flex items-center justify-center rounded-full transition-all shrink-0
                          ${
                            questionId === question._id
                              ? "w-3 h-3 sm:w-4 sm:h-4 bg-brand-cream"
                              : question.position <=
                                  (user.onboardingProgress || 1)
                                ? "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-cream"
                                : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-cream/35"
                          }
                          ${
                            user.onboardingProgress === undefined ||
                            question.position > user.onboardingProgress
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:bg-brand-cream/70"
                          }
                        `}
                          onClick={() =>
                            setSearchParams({ question: question._id })
                          }
                          disabled={
                            user.onboardingProgress === undefined ||
                            question.position > user.onboardingProgress
                          }
                        >
                          {questionId === question._id && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-green rounded-full" />
                          )}
                        </button>
                        {index <
                          questions.slice(Math.ceil(questions.length / 2))
                            .length -
                            1 && (
                          <div
                            className={`w-4 sm:w-6 md:w-8 h-[1px] sm:h-[2px] mx-1 sm:mx-2 ${
                              question.position < (user.onboardingProgress || 1)
                                ? "bg-brand-cream"
                                : "bg-brand-cream/10"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
              {questionId &&
                questionId !== "undefined" &&
                questionId !== null &&
                questionId !== "complete" && (
                  <OnboardingQuestion
                    user={user}
                    questionId={questionId}
                    recognitionRef={recognitionRef}
                  />
                )}
              {(questionId === "complete" ||
                (user.onboardingProgress &&
                  user.onboardingProgress > questions.length)) && (
                <OnboardingComplete />
              )}
              {questionId !== "complete" && (
                <OnboardingNavigation
                  questions={questions}
                  user={user}
                  recognitionRef={recognitionRef}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
