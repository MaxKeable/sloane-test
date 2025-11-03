import { useChatAssistantList } from "@/api/use-chat-api";
import AssistantCard from "@/app/components/ai-chats/assistant-card";
import AssistantList from "@/app/components/ai-chats/assistant-list";
import PageWrapper from "@/app/components/core/page-wrapper";

export default function AiChatsPage() {
  const { data, isLoading, error } = useChatAssistantList();

  if (error) return <div>Failed to load assistants: {error.message}</div>;

  return (
    <PageWrapper title="Ai Chats" containerClasses="text-white">
      <div className="flex">
        <AssistantCard assistant={data?.freeStyle} isLoading={isLoading} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold ">Sloane Experts</p>
        <AssistantList assistants={data?.assistants} isLoading={isLoading} />
      </div>
    </PageWrapper>
  );
}
