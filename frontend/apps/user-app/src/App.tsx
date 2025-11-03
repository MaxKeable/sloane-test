import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/theme-context";
import AppContent from "./AppContent";
import { TimerProvider } from "./context/TimerContext";
import { MindfulnessProvider } from "./context/MindfulnessContext";
import { ApiProvider } from "./providers/api-provider";
import { ReactQueryProvider } from "@repo/ui-kit/providers/react-query-provider";
import { AdminApiProvider } from "./providers/admin-api-provider";
import { FeatureFlagProvider } from "./providers/feature-flag-provider";
import { UserProvider } from "./providers/user-provider";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!}
      >
        <ReactQueryProvider>
          <UserProvider>
            <TimerProvider>
              <MindfulnessProvider>
                <AdminApiProvider>
                  <ApiProvider>
                    <FeatureFlagProvider>
                      <Router>
                        <ChatProvider>
                          <AppContent />
                        </ChatProvider>
                      </Router>
                    </FeatureFlagProvider>
                  </ApiProvider>
                </AdminApiProvider>
              </MindfulnessProvider>
            </TimerProvider>
          </UserProvider>
        </ReactQueryProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default App;
