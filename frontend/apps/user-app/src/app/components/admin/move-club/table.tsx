import { useGetMoveClubs } from "@/api/admin/use-move-club-api";
import { MoveClub } from "@backend/src/model/types/move-club";
import { Button } from "@repo/ui-kit/components/ui/button";
import { DataTable } from "@repo/ui-kit/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

const columns: ColumnDef<MoveClub>[] = [
  {
    header: "Event Title",
    accessorKey: "eventTitle",
  },
  {
    header: "Event Date",
    accessorKey: "eventDateTime",
  },
  {
    header: "Duration",
    accessorKey: "duration",
  },
  {
    header: "View Details",
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/move-club/${row.original.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      );
    },
  },
];

export const MoveClubTable = () => {
  const { data, isLoading } = useGetMoveClubs();

  return (
    <div>
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </div>
  );
};
