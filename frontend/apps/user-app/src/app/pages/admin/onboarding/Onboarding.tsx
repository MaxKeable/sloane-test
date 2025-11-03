import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { QuestionService } from "../../../../services/questionService";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import QuestionTitle from "./QuestionTitle";
import QuestionOverview from "./QuestionOverview";
import ClientMessage from "../../../components/core/ClientMessage";
import CreateModal from "./CreateModal";
import { useState } from "react";

export default function AdminOnboarding() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("question");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.QUESTION.GET_ALL],
    queryFn: () => QuestionService.getQuestions(),
  });

  if (user?.publicMetadata.account !== "admin")
    return (
      <ClientMessage message="You are not authorized to access this page" />
    );
  if (isLoading) return <ClientMessage message="Loading..." />;
  if (error) return <ClientMessage message="Error loading questions" />;

  return (
    <div className="flex flex-col items-center pt-24 min-h-screen bg-brand-green">
      <h2 className="text-white text-6xl">Onboarding creator</h2>
      <p className="text-white text-lg">
        Hey <span className="text-brand-logo font-bold">Tobes!</span> configure
        your onboarding flow as you wish 🤙
      </p>
      <div className="grid grid-cols-6 gap-4 py-4 px-8 w-full pt-16">
        <div className="col-span-2 flex items-center flex-col gap-2 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white">
          {data?.map((question) => (
            <QuestionTitle
              key={question._id}
              question={question}
              isSelected={question._id === questionId}
            />
          ))}
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-6 py-2 rounded-lg border border-white text-white hover:bg-white/10 transition-colors font-semibold capitalize"
          >
            + add question
          </button>
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          {questionId && <QuestionOverview questionId={questionId} />}
        </div>
      </div>
      {isOpen && data && (
        <CreateModal
          position={data.length + 1}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
