import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { MoveClubUpdateRequest } from "../../model/types";

logger.info("Updating move club");

export const updateMoveClub = async (
  id: string,
  inputs: MoveClubUpdateRequest
) => {
  const moveClub = await prisma.moveClub.update({
    where: { id },
    data: inputs,
  });
  return moveClub;
};
