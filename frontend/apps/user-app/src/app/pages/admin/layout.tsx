import Sidebar from "@/app/components/Sidebar/side-bar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="h-screen bg-brand-green w-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
