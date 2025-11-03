import { Button } from "@repo/ui-kit/components/ui/button";
import { Dialog } from "@repo/ui-kit/components/ui/dialog";
import { FolderResponse } from "@backend/types";
import FolderItem from "./folder-item";
import { useState } from "react";
import ItemSkeletons from "../skeletons/item-skeletons";
import { useCreateFolder } from "@/api/use-folder-api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/providers/api-provider";
import { DroppableFolder } from "../dnd/DroppableFolder";

type Props = {
  folders: FolderResponse[];
  isLoading: boolean;
};

export default function FolderList({ folders, isLoading }: Props) {
  const params = useParams();
  const [isOpen, setIsOpen] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { mutateAsync: createFolderMutation, isPending: isCreatingFolder } =
    useCreateFolder();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const assistantId = params.assistantId ?? "";

  const handleCreateFolder = async () => {
    const title = folderName.trim() || "New Folder";

    // Optimistically insert at top
    const tempId = `temp-${crypto.randomUUID?.() || Date.now()}`;
    const tempFolder = { id: tempId, title, chats: [] };
    queryClient.setQueryData(
      trpc.chats.list.queryKey({ assistantId }),
      (old: any) => {
        if (!old) return old;
        return { ...old, folders: [tempFolder, ...(old.folders || [])] };
      }
    );

    setDialogOpen(false);
    setFolderName("");

    try {
      const created = await createFolderMutation({ assistantId, title });

      // Reconcile temp→real, keep at index 0
      queryClient.setQueryData(
        trpc.chats.list.queryKey({ assistantId }),
        (old: any) => {
          if (!old) return old;
          const next = { ...old };
          next.folders = [
            created,
            ...(old.folders || []).filter((f: any) => f.id !== tempId),
          ];
          return next;
        }
      );
      toast.success("Folder created");
    } catch (e) {
      // Rollback
      queryClient.setQueryData(
        trpc.chats.list.queryKey({ assistantId }),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            folders: (old.folders || []).filter((f: any) => f.id !== tempId),
          };
        }
      );
      toast.error("Failed to create folder");
    }
  };

  return (
    <div className="w-full text-white">
      <p className="font-medium text-sm">Folders</p>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Button
          variant="outline"
          className="border-none w-full"
          onClick={() => {
            // Instant create; keep dialog available for named create
            handleCreateFolder();
          }}
          disabled={isCreatingFolder}
        >
          {isCreatingFolder ? "Creating..." : "New Folder"}
        </Button>
        {/* Optional: keep dialog for explicit naming if desired in future */}
      </Dialog>
      <div className="flex flex-col gap-1 mt-2">
        {isLoading ? (
          <ItemSkeletons />
        ) : (
          folders.map((folder) => (
            <DroppableFolder
              key={folder.id}
              folderId={folder.id}
              folderName={folder.title}
              chats={folder.chats}
              isOpen={isOpen === folder.id}
              toggleOpen={() =>
                setIsOpen((v) => (v === folder.id ? undefined : folder.id))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
