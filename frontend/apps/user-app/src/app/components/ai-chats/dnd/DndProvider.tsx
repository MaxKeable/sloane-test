import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  closestCenter,
} from "@dnd-kit/core";
import { useTRPC } from "../../../../providers/api-provider";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { FaComment } from "react-icons/fa";
import { useMoveChat, useReorderChat } from "../../../../api/use-folder-api";

interface DndProviderProps {
  children: React.ReactNode;
  assistantId: string;
}

export function DndProvider({ children, assistantId }: DndProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const moveChatMutation = useMoveChat();
  const reorderChatMutation = useReorderChat();

  // Configure sensors for both mouse and touch
  // Touch sensor with 100ms delay to avoid conflicts with scrolling
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // 100ms delay for touch
        tolerance: 5, // 5px movement tolerance
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Get the chat title for the overlay
    const chatData = queryClient.getQueryData(
      trpc.chats.list.queryKey({ assistantId })
    ) as any;

    if (chatData) {
      // Search in root chats
      const rootChat = chatData.chats?.find((c: any) => c.id === active.id);
      if (rootChat) {
        setActiveTitle(rootChat.title);
        return;
      }

      // Search in folders
      for (const folder of chatData.folders || []) {
        const folderChat = folder.chats?.find((c: any) => c.id === active.id);
        if (folderChat) {
          setActiveTitle(folderChat.title);
          return;
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveTitle(null);
    setOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Skip if dropping on itself
    if (activeId === overId) return;

    // Skip if this is a temp chat (not yet saved)
    if (activeId.startsWith("temp-")) {
      toast.error("Please wait for the chat to be created");
      return;
    }

    try {
      // Get current chat data to determine source context
      const chatData = queryClient.getQueryData(
        trpc.chats.list.queryKey({ assistantId })
      ) as any;

      if (!chatData) return;

      // Find source context (which folder or root the chat is in)
      let sourceFolderId: string | undefined = undefined;
      let sourceIndex = -1;

      // Check root chats
      const rootChatIndex = chatData.chats?.findIndex(
        (c: any) => c.id === activeId
      );
      if (rootChatIndex !== -1) {
        sourceIndex = rootChatIndex;
        sourceFolderId = undefined;
      } else {
        // Check folders
        for (const folder of chatData.folders || []) {
          const folderChatIndex = folder.chats?.findIndex(
            (c: any) => c.id === activeId
          );
          if (folderChatIndex !== -1) {
            sourceIndex = folderChatIndex;
            sourceFolderId = folder.id;
            break;
          }
        }
      }

      // Determine target context
      const isTargetFolder = overId.startsWith("folder-");
      const isTargetRoot = overId === "root-chats";
      const isTargetChat = !isTargetFolder && !isTargetRoot;

      if (isTargetFolder) {
        // Moving chat into a folder
        const targetFolderId = overId.replace("folder-", "");

        // If moving from same folder, skip
        if (sourceFolderId === targetFolderId) return;

        await moveChatMutation.mutateAsync({
          chatId: activeId,
          folderId: targetFolderId,
        });
        toast.success("Chat moved to folder");
      } else if (isTargetRoot) {
        // Moving chat to root (out of folder)
        if (sourceFolderId === undefined) return; // Already in root

        await moveChatMutation.mutateAsync({
          chatId: activeId,
          folderId: undefined,
        });
        toast.success("Chat moved to root");
      } else if (isTargetChat) {
        // Reordering within same context
        // Find target context
        let targetFolderId: string | undefined = undefined;
        let targetIndex = -1;

        // Check root chats
        const rootTargetIndex = chatData.chats?.findIndex(
          (c: any) => c.id === overId
        );
        if (rootTargetIndex !== -1) {
          targetIndex = rootTargetIndex;
          targetFolderId = undefined;
        } else {
          // Check folders
          for (const folder of chatData.folders || []) {
            const folderTargetIndex = folder.chats?.findIndex(
              (c: any) => c.id === overId
            );
            if (folderTargetIndex !== -1) {
              targetIndex = folderTargetIndex;
              targetFolderId = folder.id;
              break;
            }
          }
        }

        // Only reorder if in same context
        if (
          sourceFolderId === targetFolderId &&
          sourceIndex !== -1 &&
          targetIndex !== -1
        ) {
          // Calculate new index (insert before target)
          const newIndex =
            sourceIndex < targetIndex ? targetIndex : targetIndex;

          await reorderChatMutation.mutateAsync({
            chatId: activeId,
            newIndex,
            folderId: sourceFolderId,
            assistantId,
          });
        }
      }
    } catch (error) {
      console.error("Error handling drag:", error);
      toast.error("Failed to move chat");
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveTitle(null);
    setOverId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay>
        {activeId && activeTitle ? (
          <div className="bg-white/20 rounded-lg shadow-2xl p-3 cursor-grabbing opacity-90 border-2 border-accent">
            <div className="flex items-center gap-2">
              <FaComment className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <p className="truncate max-w-[200px] font-medium text-gray-900 dark:text-white">
                {activeTitle}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
