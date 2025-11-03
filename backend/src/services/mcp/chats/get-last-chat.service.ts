import prisma from "../../../../config/client";

export const getLastChatService = async () => {
  const userId = "user_31tiLXd9ywrcRGgxiBfKNDjl0we";
  const lastChat = await prisma.chats.findFirst({
    where: { user: userId },
    orderBy: { createdAt: "desc" },
  });

  if (!lastChat || !lastChat.messages || lastChat.messages.length === 0) {
    throw new Error("No chat or messages found");
  }

  console.log(lastChat.messages);

  const lastMessage = lastChat.messages[lastChat.messages.length - 1];

  return lastMessage.answer;
};
