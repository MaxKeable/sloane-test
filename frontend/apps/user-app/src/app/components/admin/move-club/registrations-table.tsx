import { MoveClubWithRegistrationsWithUser } from "@/api/admin/use-move-club-api";
import { MoveClubRegistration } from "@backend/src/model/types";
import { DataTable } from "@repo/ui-kit/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  moveClub: MoveClubWithRegistrationsWithUser;
  isLoading?: boolean;
};

export const MoveClubRegistrationsTable = ({ moveClub, isLoading }: Props) => {
  if (!moveClub) {
    return <div>No move club registrations</div>;
  }

  const columns: ColumnDef<MoveClubRegistration>[] = [
    {
      header: "Name",
      accessorKey: "user.name",
    },
    {
      header: "Email",
      accessorKey: "user.email",
    },
    {
      header: "Invited Friend",
      accessorKey: "invitedFriend",
    },
    {
      header: "Added to Calendar",
      accessorKey: "addedToCalendar",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={moveClub.registrations}
        isLoading={false}
      />
    </div>
  );
};
