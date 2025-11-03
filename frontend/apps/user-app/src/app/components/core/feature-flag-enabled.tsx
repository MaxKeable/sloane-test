import React, { type ReactNode } from "react";
import { useFeatureFlags } from "@/providers/feature-flag-provider";
import { FeatureFlagNames } from "@backend/src/model/types";

interface FeatureFlagEnabledProps {
  featureName: FeatureFlagNames;
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureFlagEnabled: React.FC<FeatureFlagEnabledProps> = ({
  featureName,
  children,
  fallback = null,
}) => {
  const { isFeatureEnabled, isLoading } = useFeatureFlags();

  if (isLoading) {
    return <>{fallback}</>;
  }

  return isFeatureEnabled(featureName) ? <>{children}</> : <>{fallback}</>;
};
