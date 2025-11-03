import React, { createContext, useContext, type ReactNode } from "react";
import { useFeatureFlag } from "@/api/use-feature-flag-api";
import { FeatureFlag } from "@backend/src/model/types";

interface FeatureFlagContextType {
  featureFlags: FeatureFlag[];
  isLoading: boolean;
  error: Error | null;
  isFeatureEnabled: (featureName: string) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(
  undefined
);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider"
    );
  }
  return context;
};

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
}) => {
  const { data: featureFlags = [], isLoading, error } = useFeatureFlag();

  const isFeatureEnabled = (featureName: string): boolean => {
    const feature = featureFlags.find(
      (flag) => flag.name.toLowerCase() === featureName.toLowerCase()
    );
    return feature?.isEnabled ?? false;
  };

  const contextValue: FeatureFlagContextType = {
    featureFlags,
    isLoading,
    error: error as Error | null,
    isFeatureEnabled,
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
