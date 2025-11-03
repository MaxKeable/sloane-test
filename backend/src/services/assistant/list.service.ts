import prisma from "../../../config/client";
import { logger } from "../../../utils/logger";
import { AssistantListResponse } from "../../model/types/assistant";

logger.info("Listing assistants");

export async function listAssistants(): Promise<AssistantListResponse> {
  const freeStyle = await prisma.assistants.findFirst({
    where: { name: "FreeStyle" },
    select: { id: true, name: true, description: true, allowModelSelection: true },
  });

  const assistants = await prisma.assistants.findMany({
    where: { name: { not: "FreeStyle" } },
    select: { id: true, name: true, description: true, allowModelSelection: true },
    orderBy: { name: "asc" },
  });

  return { freeStyle, assistants };
}
