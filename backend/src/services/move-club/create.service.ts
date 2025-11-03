import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { MoveClubCreateRequest } from "../../model/types/move-club";

logger.info("Creating move club");

export const createMoveClub = async (inputs: MoveClubCreateRequest) => {
  const moveClub = await prisma.moveClub.create({
    data: inputs,
  });
  return moveClub;
};
