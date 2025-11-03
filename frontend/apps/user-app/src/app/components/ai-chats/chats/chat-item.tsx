import { Button } from "@repo/ui-kit/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui-kit/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui-kit/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui-kit/components/ui/alert-dialog";
import { Input } from "@repo/ui-kit/components/ui/input";
import { Label } from "@repo/ui-kit/components/ui/label";
import { FaComment, FaPen, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@repo/ui-kit/components/ui/spinner";

type Props = {
  chatTitle: string;
  chatId: string;
  onRename?: (newTitle: string) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isRenaming?: boolean;
};

export default function ChatItem({
  chatTitle,
  chatId,
  onRename,
  onDelete,
  isDeleting,
  isRenaming,
}: Props) {
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState(chatTitle);
  const [searchParams] = useSearchParams();
  const isSelected = searchParams.get("chat") === chatId;
  const isTemp = chatId.startsWith("temp-");
  return (
    <Button
      variant="ghost"
      className={`group relative inline-flex items-center justify-start w-full dark:hover:bg-white/10 dark:hover:text-white pr-12 ${
        isSelected ? "bg-white/10 dark:bg-white/10" : ""
      } ${isTemp ? "opacity-80" : ""}`}
      onClick={() => {
        navigate({ search: `chat=${chatId}` });
      }}
    >
      <div className="flex items-center gap-2">
        <FaComment className="w-4 h-4" />
        <p className="truncate max-w-[190px]">{chatTitle}</p>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Dialog>
          <Tooltip delayDuration={150} skipDelayDuration={250}>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-md hover:bg-white/20 opacity-0 translate-x-1 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                  aria-label="Edit chat"
                  disabled={isTemp}
                >
                  <FaPen className="w-3.5 h-3.5" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Edit chat
            </TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename chat</DialogTitle>
              <DialogDescription>
                Update the name for this chat.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="chat-name">Chat name</Label>
              <Input
                id="chat-name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter a new chat name"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (onRename) onRename(newTitle.trim());
                  }}
                  disabled={isTemp}
                >
                  {isRenaming ? "Saving..." + <Spinner /> : "Save"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <Tooltip delayDuration={150} skipDelayDuration={250}>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-md hover:bg-white/20 opacity-0 translate-x-1 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                  aria-label="Delete chat"
                  disabled={isTemp}
                >
                  <FaTimes className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Delete chat
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete?.()}>
                {isDeleting ? "Deleting..." + <Spinner /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Button>
  );
}
