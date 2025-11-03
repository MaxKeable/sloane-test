import { ListChatsResponse } from "@backend/src/model/types";
import { Button } from "@repo/ui-kit/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/ui-kit/components/ui/sheet";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";
import { SideBarContent } from "./side-bar-content";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  onBack: () => void;
  data?: ListChatsResponse;
  isLoading: boolean;
  assistantId: string;
};

export const MobileSidebar = ({ onBack, data, isLoading, assistantId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chat");

  useEffect(() => {
    if (chatId) {
      setIsOpen(false);
    }
  }, [chatId]);

  return (
    <div className="lg:hidden fixed top-0 left-0 bg-brand-green flex flex-col z-10 w-[200px] rounded-r-md pb-3">
      <div>
        <Button variant={"link"} onClick={onBack}>
          <FaArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      <div className="px-3 flex-1 min-h-0 flex flex-col gap-2">
        <p className="font-black text-accent text-3xl shrink-0">
          {data?.assistantName ?? "Expert"}
        </p>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <Button variant="outline" className="border-none w-full text-white">
              Open Sidebar
              <FaChevronRight className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-brand-green text-white border-none max-w-[325px]"
          >
            <SideBarContent data={data} isLoading={isLoading} assistantId={assistantId} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
