import { useGetOneMoveClub } from "@/api/admin/use-move-club-api";
import { AdminHeader } from "@/app/components/admin/admin-header";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui-kit/components/ui/card";
import LoadingSpinner from "@/app/pages/Dashboard/LoadingSpinner";
import { EditMoveClub } from "@/app/components/admin/move-club/edit-club";
import { DeleteMoveClub } from "@/app/components/admin/move-club/delete-club";
import { MoveClubRegistrationsTable } from "@/app/components/admin/move-club/registrations-table";

export default function MoveClubDetailsPage() {
  const { moveClubId } = useParams();
  const { data: moveClub, isLoading } = useGetOneMoveClub(moveClubId ?? "");

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <AdminHeader
        title={moveClub?.eventTitle ?? ""}
        description={moveClub?.eventTitle ?? ""}
      />
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Move Club Details</CardTitle>
          <div className="flex items-center gap-2">
            {moveClub && <DeleteMoveClub moveClub={moveClub} />}
            {moveClub && <EditMoveClub moveClub={moveClub} />}
          </div>
        </CardHeader>
        <CardContent>
          <label className="text-sm font-medium">Event Title</label>
          <p>{moveClub?.eventTitle}</p>
          <label className="text-sm font-medium">Event Date</label>
          <p>{moveClub?.eventDateTime?.toLocaleString()}</p>
          <label className="text-sm font-medium">Duration</label>
          <p>{moveClub?.duration}</p>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Move Club Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <MoveClubRegistrationsTable
            moveClub={moveClub}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
