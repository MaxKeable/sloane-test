import { ListChatsResponse } from "@backend/src/model/types";
import ChatList from "../chats/chat-list";
import FolderList from "../folders/folder-list";
import { DndProvider } from "../dnd/DndProvider";

type Props = {
  data?: ListChatsResponse;
  isLoading: boolean;
  assistantId: string;
};

export const SideBarContent = ({ data, isLoading, assistantId }: Props) => {
  return (
    <DndProvider assistantId={assistantId}>
      <div className="px-3 flex-1 min-h-0 flex flex-col">
        <p className="font-black text-accent text-3xl shrink-0">
          {data?.assistantName ?? "Expert"}
        </p>
        <div className="mt-6 flex-1 min-h-0 overflow-y-auto overflow-x-hidden -mr-3 pr-3 flex flex-col gap-4">
          <FolderList folders={data?.folders ?? []} isLoading={isLoading} />
          <ChatList chats={data?.chats ?? []} isLoading={isLoading} />
        </div>
      </div>
    </DndProvider>
  );
};
