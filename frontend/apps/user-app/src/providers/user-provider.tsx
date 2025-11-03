import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser as useClerkUser } from "@clerk/clerk-react";
import { UserService } from "../services/userService";
import { QUERY_KEYS } from "../constants/queryKeys";
import { User, SubscriptionDetails } from "../types/user";

interface UserContextType {
  user: User | null | undefined;
  subscription: SubscriptionDetails | null | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { isSignedIn, isLoaded: clerkLoaded } = useClerkUser();

  // Fetch user data (now includes subscription)
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER.ME],
    queryFn: UserService.getMe,
    enabled: isSignedIn && clerkLoaded,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes (formerly cacheTime)
    retry: 1,
  });

  const contextValue: UserContextType = {
    user: userData || null,
    subscription: userData?.subscription || null,
    isLoading: !clerkLoaded || (isSignedIn && isLoading),
    isError,
    error: error as Error | null,
    refetch,
    isAuthenticated: isSignedIn ?? false,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
