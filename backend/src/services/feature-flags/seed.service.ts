import { FeatureFlagName } from "@prisma/client";
import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

logger.info("Seeding feature flags");

export const seedFeatureFlags = async () => {
  await prisma.featureFlags.deleteMany();
  await prisma.featureFlags.createMany({
    data: [{ name: FeatureFlagName.MOVE_CLUB, isEnabled: true }],
  });

  logger.info("Feature flags seeded");

  return true;
};
