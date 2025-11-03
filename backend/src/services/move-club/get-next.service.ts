import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

logger.info("Getting next move club");

export const getNextMoveClub = async (userId: string) => {
  const moveClub = await prisma.moveClub.findFirst({
    where: { eventDateTime: { gt: new Date() } },
    include: {
      registrations: {
        where: {
          userId,
        },
      },
    },
    orderBy: { eventDateTime: "asc" },
  });
  return moveClub;
};
