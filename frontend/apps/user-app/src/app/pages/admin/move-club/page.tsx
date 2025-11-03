import { AdminHeader } from "@/app/components/admin/admin-header";
import { CreateMoveClub } from "@/app/components/admin/move-club/create-club";
import { MoveClubTable } from "@/app/components/admin/move-club/table";
import { Card, CardContent, CardHeader } from "@repo/ui-kit/components/ui/card";

export default function MoveClubPage() {
  return (
    <div className="w-full">
      <AdminHeader title="Move Club" description="Manage Move Clubs" />
      <Card>
        <CardHeader>
          <CreateMoveClub />
        </CardHeader>
        <CardContent>
          <MoveClubTable />
        </CardContent>
      </Card>
    </div>
  );
}
