import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@repo/ui-kit/components/ui/button";
import { ListChatsResponse } from "@backend/src/model/types";
import { SideBarContent } from "./side-bar-content";

type Props = {
  onBack: () => void;
  data?: ListChatsResponse;
  isLoading: boolean;
  assistantId: string;
};

export const ChatSidebar = ({ onBack, data, isLoading, assistantId }: Props) => {
  return (
    <div className="hidden h-full w-[325px] bg-brand-green py-2 lg:flex flex-col">
      <div>
        <Button variant={"link"} onClick={onBack}>
          <FaArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      <SideBarContent data={data} isLoading={isLoading} assistantId={assistantId} />
    </div>
  );
};
