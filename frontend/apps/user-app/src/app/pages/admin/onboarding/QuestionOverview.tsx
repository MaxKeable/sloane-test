import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuestionService } from "../../../../services/questionService";
import ReactPlayer from "react-player";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import QuestionActions from "./QuestionActions";
import { Question } from "../../../../types/question";
import { toast } from "react-hot-toast";

type Props = {
  questionId: string;
};

type FormInputs = {
  videoUrl: string;
  title: string;
  description?: string;
  placeholderSentence?: string;
  serviceBusinessExample?: string;
  productBusinessExample?: string;
};

export default function QuestionOverview({ questionId }: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.QUESTION.GET_ONE, questionId],
    queryFn: () => QuestionService.getQuestion(questionId),
  });

  const { mutate: updateQuestion, isPending: isSaving } = useMutation({
    mutationFn: (data: Partial<Question>) =>
      QuestionService.updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUESTION.GET_ONE, questionId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.QUESTION.GET_ALL],
      });
      toast.success("Question updated");
    },
    onError: () => {
      toast.error("Error updating question");
    },
  });

  const { register, handleSubmit, setValue } = useForm<FormInputs>({
    defaultValues: {
      videoUrl: "",
      title: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("videoUrl", data.videoUrl);
      setValue("title", data.title);
      if (data.description) setValue("description", data.description);
      if (data.placeholderSentence)
        setValue("placeholderSentence", data.placeholderSentence);
      if (data.serviceBusinessExample)
        setValue("serviceBusinessExample", data.serviceBusinessExample);
      if (data.productBusinessExample)
        setValue("productBusinessExample", data.productBusinessExample);
    }
  }, [data, setValue]);

  const onSubmit = (formData: FormInputs) => {
    updateQuestion(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading question</div>;

  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-4 bg-white h-[350px]">
        <ReactPlayer
          url={data?.videoUrl}
          width="100%"
          height="100%"
          controls={true}
          stopOnUnmount={true}
        />
        <input
          {...register("videoUrl")}
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Video URL"
        />
      </div>
      <div className="col-span-2 space-y-2">
        <input
          {...register("title")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Title"
        />
        <textarea
          {...register("description")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Description"
          rows={3}
        />
        <input
          {...register("placeholderSentence")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Placeholder Sentence"
        />
        <textarea
          {...register("serviceBusinessExample")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Service Business Example"
          rows={3}
        />
        <textarea
          {...register("productBusinessExample")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Product Business Example"
          rows={3}
        />
        <QuestionActions
          questionId={questionId}
          onSubmit={handleSubmit(onSubmit)}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
