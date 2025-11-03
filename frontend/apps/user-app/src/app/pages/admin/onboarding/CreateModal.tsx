import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { QuestionService } from "../../../../services/questionService";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { toast } from "react-hot-toast";
import { CreateQuestion } from "../../../../types/question";

type Props = {
  position: number;
  onClose: () => void;
};

export default function CreateModal({ position, onClose }: Props) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<CreateQuestion>({
    defaultValues: {
      videoUrl: "",
      title: "",
      description: "",
      placeholderSentence: "",
      serviceBusinessExample: "",
      productBusinessExample: "",
      position: position,
    },
  });

  const { mutate: createQuestion, isPending } = useMutation({
    mutationFn: (data: CreateQuestion) =>
      QuestionService.createQuestion({ ...data, position }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUESTION.GET_ALL],
      });
      toast.success("Question created successfully");
      onClose();
    },
    onError: () => {
      toast.error("Error creating question");
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-brand-green-dark">
          Create New Question
        </h2>
        <form
          onSubmit={handleSubmit((data) => createQuestion(data))}
          className="space-y-4"
        >
          <div>
            <input
              {...register("title")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
            />
          </div>
          <div>
            <input
              {...register("videoUrl")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Video URL"
            />
          </div>
          <div>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
              rows={3}
            />
          </div>
          <div>
            <input
              {...register("placeholderSentence")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Placeholder Sentence"
            />
          </div>
          <div>
            <textarea
              {...register("serviceBusinessExample")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Service Business Example Answer"
              rows={3}
            />
          </div>
          <div>
            <textarea
              {...register("productBusinessExample")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product Based Business Example"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-dark disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
