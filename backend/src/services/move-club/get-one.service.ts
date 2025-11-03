import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";

export const getOneMoveClub = async (id: string) => {
  logger.info(`Getting move club with id: ${id}`);

  const moveClub = await prisma.moveClub.findUnique({
    where: { id },
    include: {
      registrations: true,
    },
  });

  if (!moveClub) {
    logger.info(`Move club not found with id: ${id}`);
    return null;
  }

  const registrationsWithUser = await Promise.all(
    moveClub.registrations.map(async (registration) => ({
      ...registration,
      user: await prisma.users.findUnique({
        where: { clerkUserId: registration.userId },
      }),
    }))
  );

  return {
    ...moveClub,
    registrations: registrationsWithUser,
  };
};
