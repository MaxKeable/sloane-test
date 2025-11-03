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

export const CreateMoveClub = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-end">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Create Move Club</Button>
        </SheetTrigger>
        <SheetContent className="max-w-2xl">
          <SheetHeader>
            <SheetTitle>Create Move Club</SheetTitle>
            <SheetDescription>
              Create a new move club event here.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <MoveClubForm onSuccess={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
