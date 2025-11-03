import { useGetUsers } from "@/api/admin/use-user-api";
import { AllUsersTable } from "@/app/components/admin/users/all-users-table";
import { AdminHeader } from "@/app/components/admin/admin-header";

const AllUsersPage = () => {
  const { data: users, isLoading } = useGetUsers();

  return (
    <div className="w-full  bg-brand-green flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-7xl">
        <AdminHeader
          title="All Users"
          description="Manage and view all registered users"
        />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <AllUsersTable data={users || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
