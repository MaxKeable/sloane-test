import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { MoveClubRegistrationUpdateRequest } from "../../model/types";

logger.info("Updating move club registration");

export const updateMoveClubRegistration = async (
  userId: string,
  moveClubRegistration: MoveClubRegistrationUpdateRequest
) => {
  const { id, ...updateData } = moveClubRegistration;
  const updatedMoveClubRegistration = await prisma.moveClubRegistration.update({
    where: { id, userId },
    data: updateData,
  });

  return updatedMoveClubRegistration;
};
