import { useDroppable } from "@dnd-kit/core";
import FolderItem from "../folders/folder-item";
import { ChatResponse } from "@backend/types";

interface DroppableFolderProps {
  folderId: string;
  folderName: string;
  chats: ChatResponse[];
  isOpen: boolean;
  toggleOpen: () => void;
}

export function DroppableFolder({
  folderId,
  folderName,
  chats,
  isOpen,
  toggleOpen,
}: DroppableFolderProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folderId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${isOver ? "ring-2 ring-accent ring-inset rounded-md" : ""}`}
    >
      <FolderItem
        folderId={folderId}
        folderName={folderName}
        chats={chats}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />
    </div>
  );
}
