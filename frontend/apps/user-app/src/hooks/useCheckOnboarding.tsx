import { useUserContext } from "../providers/user-provider";

export interface OnboardingState {
  isLoading: boolean;
  isAuthenticated: boolean;
  needsSubscription: boolean;
  needsOnboarding: boolean;
  isReady: boolean;
}

/**
 * Hook to check user's authentication and onboarding status.
 * Returns state object - does NOT handle navigation.
 * Components should use this state to decide their own navigation/rendering.
 */
export const useCheckOnboarding = (): OnboardingState => {
  const { user, subscription, isLoading, isAuthenticated } = useUserContext();

  // Still loading user data or Clerk
  if (isLoading) {
    return {
      isLoading: true,
      isAuthenticated: false,
      needsSubscription: false,
      needsOnboarding: false,
      isReady: false,
    };
  }

  // Not signed in
  if (!isAuthenticated || !user) {
    return {
      isLoading: false,
      isAuthenticated: false,
      needsSubscription: false,
      needsOnboarding: false,
      isReady: false,
    };
  }

  // Needs subscription
  const needsSubscription = subscription?.isActive === false;

  // Onboarding is optional - users can access dashboard without completing it
  const needsOnboarding = false; // Always false since onboarding is now optional

  // Ready to use app (authenticated + has subscription)
  const isReady = isAuthenticated && !needsSubscription;

  return {
    isLoading: false,
    isAuthenticated: true,
    needsSubscription,
    needsOnboarding,
    isReady,
  };
};
