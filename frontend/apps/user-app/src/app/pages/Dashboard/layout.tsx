import ProtectedRoute from "@/app/components/core/protected-route";
import Sidebar from "@/app/components/Sidebar/side-bar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useUserContext } from "@/providers/user-provider";

export default function DashboardLayout() {
  const location = useLocation();
  const { isAuthenticated, user } = useUserContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user?.subscription?.isActive) {
    return <Navigate to="/subscription" replace />;
  }

  return (
    <div className="h-screen bg-brand-green w-full flex">
      <Sidebar />
      <ProtectedRoute>
        <div className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </ProtectedRoute>
    </div>
  );
}
