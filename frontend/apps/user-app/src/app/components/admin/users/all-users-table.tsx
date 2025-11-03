import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@repo/ui-kit/components/ui/data-table";
import { DataTableColumnHeader } from "@repo/ui-kit/components/ui/data-table-column-header";
import { Button } from "@repo/ui-kit/components/ui/button";
import { GetAllUsersPayload } from "@backend/types";
import { useNavigate } from "react-router-dom";

interface AllUsersTableProps {
  data: GetAllUsersPayload[];
  isLoading: boolean;
}

export const AllUsersTable = ({ data, isLoading }: AllUsersTableProps) => {
  const navigate = useNavigate();

  const handleViewUser = (user: GetAllUsersPayload) => {
    navigate(`/updateUser/${user.name}?clerkUserId=${user.clerkUserId}`);
  };

  const columns: ColumnDef<GetAllUsersPayload>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "clerkUserId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Clerk ID" />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("clerkUserId")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return (
          <div className="text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewUser(row.original)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-250px)] overflow-y-auto">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClicked={handleViewUser}
      />
    </div>
  );
};
