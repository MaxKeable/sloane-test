import { Router } from "express";
import prisma from "../../config/client";

const router = Router();

router.use("/get-last-chat", async (req, res) => {
  try {
    const userId = "user_31tiLXd9ywrcRGgxiBfKNDjl0we";

    const lastChat = await prisma.chats.findFirst({
      where: { user: userId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastChat || !lastChat.messages || lastChat.messages.length === 0) {
      return res.status(404).json({
        error: "No chat or messages found",
      });
    }

    console.log(lastChat.messages);

    const lastMessage = lastChat.messages[lastChat.messages.length - 1];

    res.json({ message: lastMessage.answer });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch last chat",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
