import {
  FeatureFlagNames,
  UpdateFeatureFlagRequest,
} from "../../model/types/feature-flag";
import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

logger.info("Updating feature flag");

export const updateFeature = async (inputs: UpdateFeatureFlagRequest) => {
  const { name, isEnabled } = inputs;
  const feature = await prisma.featureFlags.update({
    where: { name },
    data: { isEnabled },
  });
  return feature;
};
