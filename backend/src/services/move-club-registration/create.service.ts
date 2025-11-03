import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

logger.info("Creating move club registration");

export const createMoveClubRegistration = async (
  userId: string,
  moveClubId: string
) => {
  const moveClubRegistration = await prisma.moveClubRegistration.create({
    data: { moveClubId, userId },
  });
  return moveClubRegistration;
};
