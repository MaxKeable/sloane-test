import { Navigate } from "react-router-dom";
import NotAdmin from "../../pages/NotAdmin";
import LoadingSpinner from "../../pages/Dashboard/LoadingSpinner";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAdmin?: boolean;
}> = ({ children, requireAdmin = false }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-brand-green flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user.publicMetadata.account !== "admin") {
    return <NotAdmin />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
