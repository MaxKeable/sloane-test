import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

logger.info("Deleting move club");

export const deleteMoveClub = async (id: string) => {
  const moveClub = await prisma.moveClub.delete({
    where: { id },
  });
  return moveClub;
};
