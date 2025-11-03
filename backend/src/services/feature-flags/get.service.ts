import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

logger.info("Getting all features");

export const getFeatures = async () => {
  const features = await prisma.featureFlags.findMany();
  return features;
};
