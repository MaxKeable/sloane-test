import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./app/pages/Dashboard/Dashboard";
import MenuBar from "./app/components/Menu/MenuBar";
import Admin from "./app/pages/admin/page";
import AssistantForm from "./app/pages/AssistantForm";
import UserForm from "./app/pages/UserForm";
import UpdateAssistant from "./app/pages/UpdateAssistant";
import Resources from "./app/pages/Resources/Resources";
import UpdateUserForm from "./app/pages/updateUserForm";
import SignUpPage from "./app/pages/auth/sign-up";
import OnboardingPage from "./app/pages/Onboarding/OnboardingPage";
import BusinessInterviewPage from "./app/pages/BusinessInterview/BusinessInterviewPage";
import AdminOnboarding from "./app/pages/admin/onboarding/Onboarding";
import AdminVideos from "./app/pages/admin/videos/AdminVideos";
import Subscription from "./app/pages/subscribe/Subscription";
import Actions from "./app/pages/Actions/Actions";
import BusinessModelPage from "./app/pages/BusinessModel/BusinessModelPage";
import ImageLibrary from "./app/pages/Dashboard/ImageLibrary";
import AdminBusinessModelPage from "./app/pages/admin/onboarding/AdminBusinessModel";
import DataInsights from "./app/pages/DataInsights";
import AllUsersPage from "./app/pages/admin/all-users/page";
import ProtectedRoute from "./app/components/core/protected-route";
import DashboardLayout from "./app/pages/Dashboard/layout";
import AdminLayout from "./app/pages/admin/layout";
import MoveClubPage from "./app/pages/admin/move-club/page";
import MoveClubDetailsPage from "./app/pages/admin/move-club/$move-club-id/page";
import FeatureFlagsPage from "./app/pages/admin/feature-flags/page";
import AiChatsPage from "./app/pages/ai-chats/page";
import AiChatPage from "./app/pages/ai-chats/[id]/page";
import WelcomePage from "./app/pages/auth/welcome";

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideMenuBarPaths = ["/userform", "/ai-chats"];

  const shouldHideMenuBar = hideMenuBarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const renderMenuBar = () => {
    if (shouldHideMenuBar) return null;
    return <MenuBar />;
  };
  // TODO: Remove dark class when we have a light mode
  return (
    <div className="relative min-h-screen dark">
      <Toaster position="bottom-left" />
      {renderMenuBar()}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-interview"
          element={
            <ProtectedRoute>
              <BusinessInterviewPage />
            </ProtectedRoute>
          }
        />
        <Route path="ai-chats/:assistantId" element={<AiChatPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ai-chats" element={<AiChatsPage />} />
          <Route
            path="/dashboard/business-model"
            element={<BusinessModelPage />}
          />
          <Route path="/dashboard/actions" element={<Actions />} />
          <Route path="/dashboard/resources" element={<Resources />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="/admin/move-club" element={<MoveClubPage />} />
          <Route
            path="/admin/move-club/:moveClubId"
            element={<MoveClubDetailsPage />}
          />
          <Route path="/admin/allUsers" element={<AllUsersPage />} />
          <Route path="/admin/feature-flags" element={<FeatureFlagsPage />} />
        </Route>
        <Route
          path="/admin/business-model/:userId"
          element={
            <ProtectedRoute requireAdmin>
              <AdminBusinessModelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/onboarding"
          element={
            <ProtectedRoute requireAdmin>
              <AdminOnboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/videos"
          element={
            <ProtectedRoute requireAdmin>
              <AdminVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/data-insights"
          element={
            <ProtectedRoute requireAdmin>
              <DataInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistantform"
          element={
            <ProtectedRoute requireAdmin>
              <AssistantForm isUpdate={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateAssistant"
          element={
            <ProtectedRoute requireAdmin>
              <UpdateAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateAssistant/:_id"
          element={
            <ProtectedRoute requireAdmin>
              <AssistantForm isUpdate={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userform"
          element={
            <ProtectedRoute requireAdmin>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateUser/:id"
          element={
            <ProtectedRoute requireAdmin>
              <UpdateUserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/image-library"
          element={
            <ProtectedRoute>
              <ImageLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default AppContent;
