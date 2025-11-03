import { useListChats } from "@/api/use-chat-api";
import { ChatWindow } from "@/app/components/ai-chats/chat-window/chat-window";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ChatSidebar } from "@/app/components/ai-chats/sidebar/chat-sidebar";
import { MobileSidebar } from "@/app/components/ai-chats/sidebar/mobile-sidebar";

export default function AiChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useListChats(params.assistantId ?? "");

  if (error) return <div>Error: {error.message}</div>;

  const handleBackClick = () => {
    navigate("/dashboard/ai-chats");
  };
  return (
    <div className="bg-brand-green-dark h-screen w-screen flex overflow-hidden">
      <ChatSidebar onBack={handleBackClick} data={data} isLoading={isLoading} assistantId={params.assistantId ?? ""} />
      <MobileSidebar
        onBack={handleBackClick}
        data={data}
        isLoading={isLoading}
        assistantId={params.assistantId ?? ""}
      />
      <div className="relative flex-1 min-w-0 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
