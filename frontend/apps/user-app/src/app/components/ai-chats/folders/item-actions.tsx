import { Button } from "@repo/ui-kit/components/ui/button";
import { motion } from "framer-motion";
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
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { Separator } from "@repo/ui-kit/components/ui/separator";
import { useState } from "react";

type Props = {
  onDelete?: () => void;
  onEdit?: (newName: string) => void;
  onCreate?: () => void;
  folderName?: string;
  folderId?: string;
  isCreatingChat?: boolean;
  isDeletingFolder?: boolean;
  isRenamingFolder?: boolean;
};

export default function FolderItemActions({
  onDelete,
  onEdit,
  onCreate,
  folderName,
  folderId,
  isCreatingChat,
  isDeletingFolder,
  isRenamingFolder,
}: Props) {
  const baseButton =
    "inline-flex items-center justify-center dark:hover:bg-white/15 text-white transition-transform duration-150 ease-out dark:hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/30";

  const renderToolTipText = (text: string) => {
    return <p className="text-white">{text}</p>;
  };

  const [newName, setNewName] = useState(folderName ?? "");

  return (
    <div className="flex items-center gap-1 border border-white/40 bg-white/5 backdrop-blur-[1px] rounded-[6px] px-1 shadow-sm">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={baseButton}
        onClick={onCreate}
        aria-label="Create chat"
        disabled={isCreatingChat}
      >
        <motion.button
          initial="rest"
          whileHover="hover"
          whileTap="hover"
          variants={{}}
        >
          <span className="inline-flex items-center gap-1">
            <motion.span
              variants={{ rest: { rotate: 0 }, hover: { rotate: 360 } }}
              transition={{
                type: "spring",
                stiffness: 800,
                damping: 26,
                mass: 0.35,
              }}
              className="inline-flex transform-gpu will-change-transform"
            >
              <FaPlus />
            </motion.span>
            <span className="text-xs">{isCreatingChat ? "Creating..." : "New chat"}</span>
          </span>
        </motion.button>
      </Button>
      <Separator orientation="vertical" className="bg-white" />
      <AlertDialog>
        <Tooltip delayDuration={150} skipDelayDuration={250}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={baseButton}
                aria-label="Delete folder"
              >
                <FaTrash />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {renderToolTipText("Delete folder")}
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete?.()} disabled={isDeletingFolder}>
              {isDeletingFolder ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog>
        <Tooltip delayDuration={150} skipDelayDuration={250}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={baseButton}
                aria-label="Edit name"
              >
                <FaPen />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {renderToolTipText("Edit name")}
          </TooltipContent>
        </Tooltip>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename folder</DialogTitle>
            <DialogDescription>Update the folder name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="folder-name">Folder name</Label>
            <Input
              id="folder-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter a new folder name"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  onEdit?.(newName.trim());
                }}
                disabled={isRenamingFolder}
              >
                {isRenamingFolder ? "Saving..." : "Save"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
