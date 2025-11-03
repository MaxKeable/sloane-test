import { useState } from "react";
import { Button } from "@repo/ui-kit/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui-kit/components/ui/sheet";
import { MoveClubForm } from "./create-club-form";
import { MoveClub } from "@backend/src/model/types";

interface EditMoveClubProps {
  moveClub: MoveClub;
}

export const EditMoveClub = ({ moveClub }: EditMoveClubProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-2xl bg-brand-white">
        <SheetHeader>
          <SheetTitle>Edit Move Club</SheetTitle>
          <SheetDescription>
            Update the move club event details.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <MoveClubForm
            moveClub={moveClub}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
