import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Question } from "../../../types/question";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { AnswerService } from "../../../services/answerService";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import VoiceToText from "./VoiceToText";
import LoadingSpinner from "../Dashboard/LoadingSpinner";

type Props = {
  question: Question;
  recognitionRef: any;
};

type FormValues = {
  answer: string;
};

export default function OnboardingAnswer({ question, recognitionRef }: Props) {
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("question");
  const { data: questionAnswer, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ANSWER.GET_BY_QUESTION_ID, questionId],
    queryFn: () => AnswerService.getAnswer(questionId ?? ""),
    enabled: !!questionId,
  });

  const queryClient = useQueryClient();

  const { register, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      answer: "",
    },
  });

  const [isListening, setIsListening] = useState(false);
  const [hasUserModified, setHasUserModified] = useState(false);
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false);

  useEffect(() => {
    reset({ answer: "" });
    setHasUserModified(false);
    if (questionAnswer?.answer) {
      setValue("answer", questionAnswer.answer);
      setHasUserModified(true);
      setIsPlaceholderActive(false);
    } else if (question.placeholderSentence) {
      setValue("answer", question.placeholderSentence + " ");
      setIsPlaceholderActive(true);
    }
  }, [
    questionId,
    reset,
    questionAnswer,
    setValue,
    question.placeholderSentence,
  ]);

  const debouncedAnswer = useDebounce(watch("answer"), 1000);

  const { mutate: createAnswer } = useMutation({
    mutationFn: (text: string) =>
      AnswerService.createAnswer({ answer: text, questionId: question._id }),
    onSuccess: () => {
      toast.success("Answer created", { position: "top-center" });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ANSWER.GET_BY_QUESTION_ID, question._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.ME],
      });
    },
  });

  const { mutate: updateAnswer } = useMutation({
    mutationFn: (text: string) =>
      AnswerService.updateAnswer({
        answer: text,
        questionId: questionAnswer?._id ?? "",
      }),
    onSuccess: () => {
      toast.success("Answer updated", { position: "top-center" });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ANSWER.GET_BY_QUESTION_ID, question._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.ME],
      });
    },
  });

  useEffect(() => {
    if (debouncedAnswer === "") {
      return;
    }

    if (questionAnswer?.answer === debouncedAnswer) {
      return;
    }

    if (!hasUserModified) {
      return;
    }

    const placeholderText = question.placeholderSentence;
    if (
      placeholderText &&
      (debouncedAnswer === placeholderText ||
        debouncedAnswer === placeholderText + " ")
    ) {
      return;
    }

    if (!questionAnswer) {
      createAnswer(debouncedAnswer);
    } else {
      updateAnswer(debouncedAnswer);
    }
  }, [
    createAnswer,
    debouncedAnswer,
    questionAnswer,
    updateAnswer,
    hasUserModified,
    question.placeholderSentence,
  ]);

  const handleToggleListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error(
        "Speech recognition is not supported in this browser. Please try Chrome."
      );
      return;
    }
    setIsListening(!isListening);
  };

  const handleTranscriptChange = (text: string) => {
    const currentAnswer = watch("answer");
    setValue("answer", currentAnswer + text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setHasUserModified(true);

    if (
      isPlaceholderActive &&
      e.key !== "Tab" &&
      e.key !== "Shift" &&
      e.key !== "Control" &&
      e.key !== "Alt" &&
      e.key !== "Meta"
    ) {
      if (e.key === "Backspace" || e.key === "Delete") {
        setIsPlaceholderActive(false);
      } else {
        setValue("answer", "");
        setIsPlaceholderActive(false);
      }
    }
  };

  const handleFocusOrClick = (
    e:
      | React.FocusEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLTextAreaElement>
  ) => {
    const textarea = e.currentTarget;
    const placeholderLength = question.placeholderSentence?.length || 0;

    if (
      isPlaceholderActive &&
      !hasUserModified &&
      question.placeholderSentence &&
      textarea.selectionStart < placeholderLength
    ) {
      textarea.setSelectionRange(placeholderLength + 1, placeholderLength + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue("answer", newValue);

    const placeholderText = question.placeholderSentence;
    if (placeholderText) {
      const isStillPlaceholder =
        newValue === placeholderText || newValue === placeholderText + " ";
      if (!isStillPlaceholder) {
        setHasUserModified(true);
        setIsPlaceholderActive(false);
      }
    } else {
      setHasUserModified(newValue.length > 0);
    }
  };

  if (isLoading || !question) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="relative">
        <textarea
          {...register("answer")}
          className="w-full h-60 p-4 mt-4 border-2 border-gray-300 rounded-lg resize-none focus:border-brand-logo/80 focus:ring-2 focus:ring-brand-green focus:outline-none transition-colors"
          onKeyDown={handleKeyDown}
          onFocus={handleFocusOrClick}
          onClick={handleFocusOrClick}
          onChange={handleInputChange}
          style={{
            color:
              isPlaceholderActive && !hasUserModified ? "#9CA3AF" : "inherit",
          }}
        />
        <button
          onClick={handleToggleListening}
          className={`absolute bottom-2 text-2xl right-2 p-2 rounded-full hidden lg:block ${
            isListening ? "text-red-500" : "text-gray-500"
          }`}
          type="button"
        >
          🎤
          {isListening && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
      <p className="text-sm text-white text-center lg:text-right mb-2">
        <span className="hidden lg:inline">
          Press the microphone to speak your answer
        </span>
        <span className="lg:hidden">
          Click the keyboard mic on your device to speak{" "}
        </span>
      </p>
      <VoiceToText
        onTranscriptChange={handleTranscriptChange}
        isListening={isListening}
        setIsListening={() => setIsListening(false)}
        onToggleListening={handleToggleListening}
        recognitionRef={recognitionRef}
      />
    </div>
  );
}
