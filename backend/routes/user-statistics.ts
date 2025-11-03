import express, { Request, Response } from "express";
import User from "../models/user";
import { Action } from "../models/actions";
import Folder from "../models/folder";
import Chat from "../models/chat";
import QuestionAnswer from "../models/question-answer";
import Assistant from "../models/assistant";
import getUserIdFromBearer from "../utils/getUserIdFromBearer";
import prisma from "../config/client";

const router = express.Router();

// Helper function to safely convert date to ISO string
const safeDateToISOString = (date: any): string | null => {
  if (!date) return null;
  try {
    // Check if date is valid
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj.toISOString();
  } catch (error) {
    console.error("Error converting date to ISO string:", error);
    return null;
  }
};

// Get individual user statistics
router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromBearer(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user
    const user = await User.findOne({ clerkUserId: userId }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get actions count and last action
    const actions = await Action.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Debug: Log all unique column values to understand what's in the database
    const uniqueColumns = [...new Set(actions.map((action) => action.column))];
    console.log(
      `[DEBUG] User ${userId} has actions with columns:`,
      uniqueColumns
    );
    console.log(`[DEBUG] Total actions found:`, actions.length);

    // Calculate actions by column (excluding 'complete')
    const actionsByColumn = {
      idea: actions.filter((action) => action.column === "idea").length,
      todo: actions.filter((action) => action.column === "toDo").length,
      inProgress: actions.filter((action) => action.column === "inProgress")
        .length,
      total: actions.filter((action) => action.column !== "complete").length,
    };

    console.log(`[DEBUG] Calculated actionsByColumn:`, actionsByColumn);

    // Get goals with timestamps
    const goals = await prisma.usergoals.findUnique({
      where: { userId },
    });

    // Get folders
    const folders = await Folder.find({ user: userId }).lean();

    // Get chats and calculate assistant usage
    const chats = await Chat.find({ user: userId }).lean();

    // Get all assistants for lookup
    const assistants = await Assistant.find({}).lean();
    const assistantsMap = new Map(
      assistants.map((assistant) => [assistant._id.toString(), assistant])
    );

    // Calculate assistant usage
    const assistantUsage = new Map<string, number>();
    chats.forEach((chat) => {
      if (chat.assistant) {
        const count = assistantUsage.get(chat.assistant.toString()) || 0;
        assistantUsage.set(chat.assistant.toString(), count + 1);
      }
    });

    // Get top assistants
    const sortedAssistants = Array.from(assistantUsage.entries())
      .map(([assistantId, count]) => {
        const assistant = assistantsMap.get(assistantId);
        return {
          name: assistant?.name || "Unknown Assistant",
          useCount: count,
          _id: assistantId,
        };
      })
      .sort((a, b) => b.useCount - a.useCount);

    const favoriteAssistant = sortedAssistants[0]?.name || null;

    // Count all custom assistants created by the user
    const customAssistantsCount = assistants.filter(
      (assistant) => assistant.user === userId
    ).length;

    // Get last used expert (most recent chat with an assistant)
    // Sort by the most recent message timestamp, then by chat updatedAt as fallback
    const lastUsedExpert = chats
      .filter(
        (chat) => chat.assistant && chat.messages && chat.messages.length > 0
      )
      .sort((a, b) => {
        // Get the most recent message timestamp for each chat
        const aLatestMessage = Math.max(
          ...a.messages.map((m) =>
            new Date(m.updatedAt || m.createdAt).getTime()
          )
        );
        const bLatestMessage = Math.max(
          ...b.messages.map((m) =>
            new Date(m.updatedAt || m.createdAt).getTime()
          )
        );

        // Sort by latest message timestamp, then by chat updatedAt as fallback
        if (aLatestMessage !== bLatestMessage) {
          return bLatestMessage - aLatestMessage;
        }
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })[0];

    const lastUsedExpertData = lastUsedExpert
      ? {
          name:
            assistantsMap.get(lastUsedExpert.assistant.toString())?.name ||
            "Unknown",
          _id: lastUsedExpert.assistant.toString(),
        }
      : null;

    console.log("Last Used Expert Debug:", {
      lastUsedExpert: lastUsedExpert
        ? {
            chatId: lastUsedExpert._id.toString(),
            assistantId: lastUsedExpert.assistant.toString(),
            updatedAt: lastUsedExpert.updatedAt,
            assistantName: assistantsMap.get(
              lastUsedExpert.assistant.toString()
            )?.name,
          }
        : null,
      lastUsedExpertData,
    });

    // Get last used chat (most recent chat with activity)
    const lastUsedChat = chats
      .filter((chat) => chat.messages && chat.messages.length > 0)
      .sort((a, b) => {
        // Get the most recent message timestamp for each chat
        const aLatestMessage = Math.max(
          ...a.messages.map((m) =>
            new Date(m.updatedAt || m.createdAt).getTime()
          )
        );
        const bLatestMessage = Math.max(
          ...b.messages.map((m) =>
            new Date(m.updatedAt || m.createdAt).getTime()
          )
        );

        // Sort by latest message timestamp, then by chat updatedAt as fallback
        if (aLatestMessage !== bLatestMessage) {
          return bLatestMessage - aLatestMessage;
        }
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })[0];

    const lastUsedChatData = lastUsedChat
      ? {
          title: lastUsedChat.title,
          _id: lastUsedChat._id.toString(),
          assistantId: lastUsedChat.assistant?.toString(),
        }
      : null;

    // Get question answers with timestamps
    const questionAnswers = await QuestionAnswer.find({ user: user._id })
      .sort({ updatedAt: -1 })
      .limit(1)
      .lean();

    // Calculate goal statistics
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const goalStats = {
      activeWeekly:
        goals?.weeklyGoals?.filter((goal: any) => !goal.isCompleted)?.length ||
        0,
      activeMonthly:
        goals?.monthlyGoals?.filter((goal: any) => !goal.isCompleted)?.length ||
        0,
      completedThisWeek:
        goals?.weeklyGoals?.filter((goal: any) => {
          if (!goal.completedAt) return false;
          const completedDate = new Date(goal.completedAt);
          return completedDate >= startOfWeek && completedDate <= now;
        })?.length || 0,
      completedThisMonth:
        goals?.monthlyGoals?.filter((goal: any) => {
          if (!goal.completedAt) return false;
          const completedDate = new Date(goal.completedAt);
          return completedDate >= startOfMonth && completedDate <= now;
        })?.length || 0,
    };

    // Safely access timestamps
    const lastAction = actions[0];
    const lastQuestionAnswer = questionAnswers[0];

    const userStats = {
      id: user._id,
      name: user.name,
      email: user.email,
      actionsCount: actionsByColumn.total,
      actionsByColumn,
      lastActionDate: safeDateToISOString(lastAction?.createdAt),
      goalsCount:
        (goals?.weeklyGoals?.length || 0) + (goals?.monthlyGoals?.length || 0),
      goalStats,
      lastGoalDate: safeDateToISOString(goals?.updatedAt),
      foldersCount: folders.length,
      customAiUsage: chats.some((chat) => chat.assistant),
      lastQuestionAnswerUpdate: safeDateToISOString(
        lastQuestionAnswer?.updatedAt
      ),
      chatsCount: chats.length,
      favoriteAssistant,
      customAssistantsCount: customAssistantsCount,
      topAssistants: sortedAssistants.slice(0, 3),
      lastUsedExpert: lastUsedExpertData,
      lastCreatedChat: lastUsedChatData,
    };

    res.status(200).json(userStats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Public route for user statistics (no admin check)
router.get("/", async (req: Request, res: Response) => {
  try {
    // Get all users with timestamps
    const users = await User.find({}).lean();

    // Get statistics for each user
    const userStats = await Promise.all(
      users.map(async (user) => {
        // Get actions count and last action
        const actions = await Action.find({ userId: user.clerkUserId })
          .sort({ createdAt: -1 })
          .lean();

        // Get goals with timestamps
        const goals = await prisma.usergoals.findUnique({
          where: {
            userId: user.clerkUserId,
          },
        });

        // Get folders
        const folders = await Folder.find({ user: user.clerkUserId }).lean();

        // Get chats
        const chats = await Chat.find({ user: user.clerkUserId }).lean();

        // Get question answers with timestamps
        const questionAnswers = await QuestionAnswer.find({ user: user._id })
          .sort({ updatedAt: -1 })
          .limit(1)
          .lean();

        // Safely access timestamps
        const lastAction = actions[0];
        const lastQuestionAnswer = questionAnswers[0];

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          actionsCount: actions.length,
          lastActionDate: safeDateToISOString(lastAction?.createdAt),
          goalsCount:
            (goals?.weeklyGoals?.length || 0) +
            (goals?.monthlyGoals?.length || 0),
          lastGoalDate: safeDateToISOString(goals?.updatedAt),
          foldersCount: folders.length,
          customAiUsage: chats.some((chat) => chat.assistant), // If they have any chats with AI assistants
          lastQuestionAnswerUpdate: safeDateToISOString(
            lastQuestionAnswer?.updatedAt
          ),
          chatsCount: chats.length,
        };
      })
    );

    res.status(200).json(userStats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
