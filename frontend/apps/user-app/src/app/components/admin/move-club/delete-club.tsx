import { useDeleteMoveClub } from "@/api/admin/use-move-club-api";
import { MoveClub } from "@backend/src/model/types";
import { Button } from "@repo/ui-kit/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui-kit/components/ui/dialog";
import { useState } from "react";
import { Spinner } from "@repo/ui-kit/components/ui/spinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  moveClub: MoveClub;
};

export const DeleteMoveClub = ({ moveClub }: Props) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteMoveClub, isPending: isDeleting } = useDeleteMoveClub();

  const handleDelete = () => {
    deleteMoveClub(
      { id: moveClub.id },
      {
        onSuccess: () => {
          toast.success("Move club deleted successfully");
          setIsOpen(false);
          navigate("/admin/move-club", { replace: true });
        },
      }
    );
  };

  return (
    <div>
      <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)}>
        Delete
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this move club? This action cannot
            be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete {isDeleting && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
