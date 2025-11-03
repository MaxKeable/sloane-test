import prisma from "../../../config/client";
import { GetChatsByUserRequest } from "../../model/types/chat";

/**
 * Get all chats for a user (admin only)
 * Used for viewing user's chat history in admin panel
 */
export async function getChatsByUser(input: GetChatsByUserRequest) {
  // First find the user by MongoDB ID to get their clerkUserId
  const user = await prisma.users.findUnique({
    where: { id: input.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Find all chats for this user
  const chats = await prisma.chats.findMany({
    where: {
      user: user.clerkUserId,
    },
    include: {
      // Include assistant details if needed
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return chats;
}
