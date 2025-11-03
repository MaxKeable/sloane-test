import { Button } from "@repo/ui-kit/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaChevronUp, FaFolder, FaFolderOpen } from "react-icons/fa";
import FolderItemActions from "./item-actions";
import { ChatResponse } from "@backend/types";
import {
  useCreateChat,
  useUpdateChatTitle,
  useDeleteChat,
} from "@/api/use-chat-api";
import { useUpdateFolderTitle, useDeleteFolder } from "@/api/use-folder-api";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import toast from "react-hot-toast";
// no local optimistic state required
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/providers/api-provider";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableChat } from "../dnd/SortableChat";

type Props = {
  isOpen: boolean;
  toggleOpen: () => void;
  folderName: string;
  folderId: string;
  chats: ChatResponse[];
};

export default function FolderItem({
  isOpen,
  toggleOpen,
  folderName,
  folderId,
  chats,
}: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const { resetChat, setSelectedChat } = useChat();
  const createChatMutation = useCreateChat();
  const updateChatMutation = useUpdateChatTitle();
  const deleteChatMutation = useDeleteChat();
  const updateFolderMutation = useUpdateFolderTitle();
  const deleteFolderMutation = useDeleteFolder();
  // Local optimistic state no longer needed; we update cache directly
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const assistantId = params.assistantId ?? "";

  const handleNewChatInFolder = async () => {
    const tempId = `temp-${crypto.randomUUID?.() || Date.now()}`;
    const tempChat: ChatResponse = { id: tempId, title: "** New Chat **" };

    // Optimistically prepend to this folder's chats in list response
    queryClient.setQueryData(
      trpc.chats.list.queryKey({ assistantId }),
      (old: any) => {
        if (!old) return old;
        const next = { ...old };
        next.folders = (old.folders || []).map((f: any) =>
          f.id === folderId
            ? { ...f, chats: [tempChat, ...(f.chats || [])] }
            : f
        );
        return next;
      }
    );

    navigate({ search: `chat=${tempId}` });
    setSelectedChat({
      id: tempId,
      title: "** New Chat **",
      messages: [],
    } as any);

    try {
      const createdChat = await createChatMutation.mutateAsync({
        assistantId,
        folderId,
      });

      // Reconcile: swap temp with real in this folder and keep at top
      queryClient.setQueryData(
        trpc.chats.list.queryKey({ assistantId }),
        (old: any) => {
          if (!old) return old;
          const next = { ...old };
          next.folders = (old.folders || []).map((f: any) =>
            f.id === folderId
              ? {
                  ...f,
                  chats: [
                    createdChat,
                    ...(f.chats || []).filter((c: any) => c.id !== tempId),
                  ],
                }
              : f
          );
          return next;
        }
      );
      navigate({ search: `chat=${createdChat.id}` }, { replace: true });
      setSelectedChat((prev: any) => ({ ...(prev || {}), ...createdChat }));
      toast.success("Chat created in folder");
    } catch (error) {
      // Rollback
      queryClient.setQueryData(
        trpc.chats.list.queryKey({ assistantId }),
        (old: any) => {
          if (!old) return old;
          const next = { ...old };
          next.folders = (old.folders || []).map((f: any) =>
            f.id === folderId
              ? {
                  ...f,
                  chats: (f.chats || []).filter((c: any) => c.id !== tempId),
                }
              : f
          );
          return next;
        }
      );
      navigate({ search: "" }, { replace: true });
      resetChat();
      toast.error("Failed to create chat");
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await updateChatMutation.mutateAsync({ chatId, title: newTitle });
      toast.success("Chat renamed");
    } catch (error) {
      toast.error("Failed to rename chat");
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChatMutation.mutateAsync({ chatId });
      resetChat();
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  const handleRenameFolder = async (newName: string) => {
    try {
      await updateFolderMutation.mutateAsync({ folderId, title: newName });
      toast.success("Folder renamed");
    } catch (error) {
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolderMutation.mutateAsync({ folderId });
      toast.success("Folder deleted • Chats moved to root");
    } catch (error) {
      toast.error("Failed to delete folder");
    }
  };

  const allChats = chats;
  const chatIds = allChats.map((chat) => chat.id);
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.18,
        ease: [0.2, 0.7, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.03,
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.16,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  } as const;

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.14,
        ease: [0.2, 0.7, 0.3, 1],
      },
    },
    closed: {
      y: -4,
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.1,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  } as const;

  return (
    <div
      className={`flex flex-col gap-1 rounded-md ${isOpen ? "bg-white/10" : ""}`}
    >
      <Button
        onClick={toggleOpen}
        className="dark:hover:bg-white/10 dark:hover:text-white"
        variant="ghost"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isOpen ? (
              <FaFolderOpen className="w-4 h-4" />
            ) : (
              <FaFolder className="w-4 h-4" />
            )}
            <p className="text-sm font-medium">{folderName}</p>
          </div>
          <motion.span
            aria-hidden
            className="inline-flex items-center"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 700, damping: 35 }}
          >
            <FaChevronUp className="w-4 h-4" />
          </motion.span>
        </div>
      </Button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="folder-content"
            className="pl-2 flex flex-col gap-1 overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
          >
            <SortableContext
              items={chatIds}
              strategy={verticalListSortingStrategy}
            >
              {allChats.map((chat) => (
                <motion.div key={chat.id} variants={itemVariants}>
                  <SortableChat
                    chatId={chat.id}
                    chatTitle={chat.title}
                    onRename={(newTitle) => handleRenameChat(chat.id, newTitle)}
                    onDelete={() => handleDeleteChat(chat.id)}
                  />
                </motion.div>
              ))}
            </SortableContext>
            <motion.div
              className="w-full px-2  pb-2 pt-1  flex justify-end"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FolderItemActions
                folderName={folderName}
                folderId={folderId}
                onCreate={handleNewChatInFolder}
                onEdit={handleRenameFolder}
                onDelete={handleDeleteFolder}
                isCreatingChat={createChatMutation.isPending}
                isDeletingFolder={deleteFolderMutation.isPending}
                isRenamingFolder={updateFolderMutation.isPending}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
