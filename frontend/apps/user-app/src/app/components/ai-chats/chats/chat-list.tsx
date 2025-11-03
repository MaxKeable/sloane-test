import { Button } from "@repo/ui-kit/components/ui/button";
import ChatItem from "./chat-item";
import { ChatResponse } from "@backend/types";
import ItemSkeletons from "../skeletons/item-skeletons";
import {
  useCreateChat,
  useUpdateChatTitle,
  useDeleteChat,
} from "@/api/use-chat-api";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/providers/api-provider";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableChat } from "../dnd/SortableChat";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  chats: ChatResponse[];
  isLoading: boolean;
};

export default function ChatList({ chats, isLoading }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const { resetChat, setSelectedChat } = useChat();
  const { mutateAsync: createChatMutation, isPending: isCreatingChat } =
    useCreateChat();
  const { mutateAsync: updateChatMutation, isPending: isUpdatingChat } =
    useUpdateChatTitle();
  const { mutateAsync: deleteChatMutation, isPending: isDeletingChat } =
    useDeleteChat();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const assistantId = params.assistantId ?? "";

  const handleNewChat = async () => {
    const tempId = `temp-${crypto.randomUUID?.() || Date.now()}`;
    const tempChat: ChatResponse = { id: tempId, title: "** New Chat **" };

    queryClient.setQueryData(
      trpc.chats.list.queryKey({ assistantId }),
      (old: any) => {
        if (!old) return old;
        return {
          ...old,
          chats: [tempChat, ...(old.chats || [])],
        };
      }
    );

    navigate({ search: `chat=${tempId}` });
    setSelectedChat({
      id: tempId,
      title: "** New Chat **",
      messages: [],
    } as any);

    try {
      const createdChat = await createChatMutation({ assistantId });

      queryClient.setQueryData(
        trpc.chats.list.queryKey({ assistantId }),
        (old: any) => {
          if (!old) return old;
          const next = { ...old };
          next.chats = [
            createdChat,
            ...(old.chats || []).filter((c: any) => c.id !== tempId),
          ];
          return next;
        }
      );

      navigate({ search: `chat=${createdChat.id}` }, { replace: true });
      setSelectedChat((prev: any) => ({ ...(prev || {}), ...createdChat }));
      toast.success("Chat created");
    } catch (e) {
      queryClient.setQueryData(
        trpc.chats.list.queryKey({ assistantId }),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            chats: (old.chats || []).filter((c: any) => c.id !== tempId),
          };
        }
      );
      navigate({ search: `` }, { replace: true });
      resetChat();
      toast.error("Failed to create chat");
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    await updateChatMutation(
      { chatId, title: newTitle },
      {
        onSuccess: () => {
          toast.success("Chat renamed");
        },
        onError: () => {
          toast.error("Failed to rename chat");
        },
      }
    );
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChatMutation(
      { chatId },
      {
        onSuccess: () => {
          toast.success("Chat deleted");
          resetChat();
        },
        onError: () => {
          toast.error("Failed to delete chat");
        },
      }
    );
  };

  const allChats = chats;
  const chatIds = allChats.map((chat) => chat.id);

  // Make the root chats area a droppable zone
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: "root-chats",
  });

  return (
    <div className="w-full text-white">
      <p className="font-medium text-sm">Chats</p>
      <Button
        variant="outline"
        className="border-none w-full dark:bg-accent dark:text-accent-foreground"
        onClick={handleNewChat}
        disabled={isCreatingChat}
      >
        {isCreatingChat ? "Creating..." : "New Chat"}
      </Button>
      <div
        ref={setDropRef}
        className={`flex flex-col gap-1 mt-2 ${
          isOver ? "ring-2 ring-blue-500 ring-inset rounded-md p-2" : ""
        }`}
      >
        {isLoading ? (
          <ItemSkeletons />
        ) : (
          <SortableContext items={chatIds} strategy={verticalListSortingStrategy}>
            {allChats.map((chat) => (
              <SortableChat
                key={chat.id}
                chatId={chat.id}
                chatTitle={chat.title}
                onRename={(newTitle) => handleRenameChat(chat.id, newTitle)}
                onDelete={() => handleDeleteChat(chat.id)}
                isDeleting={isDeletingChat}
                isRenaming={isUpdatingChat}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
