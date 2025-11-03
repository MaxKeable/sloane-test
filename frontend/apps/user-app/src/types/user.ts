export interface SubscriptionDetails {
  isActive: boolean;
  status: string | null;
  plan: string | null;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export type User = {
  name: string;
  clerkUserId: string;
  email: string;
  stripeCustomerId: string;
  onboardingCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  onboardingProgress?: number;
  subscription?: SubscriptionDetails;
};
