import { AssistantResponse } from "@backend/types";
import { Button } from "@repo/ui-kit/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui-kit/components/ui/dialog";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AssistantSkeletonItem from "./skeletons/assistant-skeleton";
import { useChat } from "@/context/ChatContext";

type Props = {
  assistant?: AssistantResponse | null;
  isLoading?: boolean;
};

export default function AssistantCard({ assistant, isLoading }: Props) {
  const navigate = useNavigate();
  const { resetChat } = useChat();

  if (!assistant || isLoading) return <AssistantSkeletonItem />;

  const handleAssistantClick = () => {
    resetChat();
    navigate(`/ai-chats/${assistant.id}`);
  };

  return (
    <Dialog>
      <div className="relative">
        <Button
          variant="outline"
          className="w-[220px] py-8 pr-10"
          onClick={handleAssistantClick}
        >
          {assistant.name}
        </Button>
        <DialogTrigger asChild>
          <span className="absolute top-2 right-2 inline-flex items-center justify-center text-popover-foreground hover:text-foreground cursor-pointer">
            <FaInfoCircle />
          </span>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{assistant.name}</DialogTitle>
          <DialogDescription>
            <span className="whitespace-pre-wrap">
              {assistant.description.replace(/\\n/g, "\n")}
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
