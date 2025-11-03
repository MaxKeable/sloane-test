import { FaSpinner } from "react-icons/fa";
import { QuestionService } from "../../../../services/questionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { useSearchParams } from "react-router-dom";

type Props = {
  questionId: string;
  onSubmit: () => void;
  isSaving: boolean;
};

export default function QuestionActions({
  questionId,
  onSubmit,
  isSaving,
}: Props) {
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();

  const { mutate: removeQuestion, isPending } = useMutation({
    mutationFn: QuestionService.removeQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUESTION.GET_ALL],
      });
      setSearchParams({});
    },
  });

  return (
    <div className="flex flex-col gap-2 pt-4">
      <button
        onClick={onSubmit}
        className="w-full px-6 py-2 rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] transition-colors flex justify-center gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Changes {isSaving && <FaSpinner className="animate-spin" />}
      </button>
      <button
        onClick={() => removeQuestion(questionId)}
        className="w-full px-6 py-2 rounded-lg border border-red-700 text-red-700 hover:bg-red-500/10 transition-colors flex justify-center gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete {isPending && <FaSpinner className="animate-spin" />}
      </button>
    </div>
  );
}
