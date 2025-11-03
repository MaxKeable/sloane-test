import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ChatItem from "../chats/chat-item";

interface SortableChatProps {
  chatId: string;
  chatTitle: string;
  onRename?: (newTitle: string) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isRenaming?: boolean;
}

export function SortableChat({
  chatId,
  chatTitle,
  onRename,
  onDelete,
  isDeleting,
  isRenaming,
}: SortableChatProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: chatId,
    disabled: chatId.startsWith("temp-"), // Disable drag for temp chats
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ChatItem
        chatId={chatId}
        chatTitle={chatTitle}
        onRename={onRename}
        onDelete={onDelete}
        isDeleting={isDeleting}
        isRenaming={isRenaming}
      />
    </div>
  );
}
