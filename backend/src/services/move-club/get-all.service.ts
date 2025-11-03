import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

logger.info("Getting all move clubs");

export const getAllMoveClubs = async () => {
  const moveClubs = await prisma.moveClub.findMany({
    orderBy: {
      eventDateTime: "asc",
    },
  });
  return moveClubs;
};
