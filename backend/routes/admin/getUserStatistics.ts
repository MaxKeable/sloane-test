import express, { Request, Response } from "express";
import User from "../../models/user";
import { Action } from "../../models/actions";
import Folder from "../../models/folder";
import Chat from "../../models/chat";
import QuestionAnswer from "../../models/question-answer";
import { clerkClient } from "@clerk/express";
import Assistant from "../../models/assistant";
import prisma from "../../config/client";

interface ClerkUser {
  id: string;
  lastSignInAt: string | null;
  signInCount: number;
  lastActiveAt: string | null;
}

interface GoalStats {
  activeWeekly: number;
  activeMonthly: number;
  completedThisWeek: number;
  completedThisMonth: number;
}

// Helper function to safely convert dates
const safeISOString = (date: any): string | null => {
  if (!date) return null;
  try {
    const d = new Date(date);
    // Check if date is valid
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
};

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    // Get all users with timestamps
    const users = await User.find({})
      .lean()
      .catch((err) => {
        console.error("Error fetching users:", err);
        return [];
      });

    // Get all assistants for quick lookup
    const assistants = await Assistant.find({}).lean();
    const assistantsMap = new Map(
      assistants.map((assistant) => [assistant._id.toString(), assistant])
    );

    // Get all Clerk users to access their session data
    let clerkUsers: ClerkUser[] = [];
    try {
      const clerkUsersResponse = await clerkClient.users.getUserList({
        limit: 100,
        orderBy: "-created_at",
      });
      clerkUsers = clerkUsersResponse.data.map((user) => ({
        id: user.id,
        lastSignInAt: user.lastSignInAt
          ? new Date(user.lastSignInAt).toISOString()
          : null,
        signInCount: (user as any).signInCount || 0,
        lastActiveAt: user.lastActiveAt
          ? new Date(user.lastActiveAt).toISOString()
          : null,
      }));
    } catch (err) {
      console.error("Error fetching Clerk users:", err);
    }

    const clerkUsersMap = new Map(clerkUsers.map((user) => [user.id, user]));

    // Create a map to track which assistants are used by multiple users
    const assistantUserCount = new Map<string, Set<string>>();

    // Get all chats to determine which assistants are used by multiple users
    const allChats = await Chat.find({})
      .lean()
      .catch(() => []);
    allChats.forEach((chat) => {
      if (chat.assistant) {
        const assistantId = chat.assistant.toString();
        const userId = chat.user;

        if (!assistantUserCount.has(assistantId)) {
          assistantUserCount.set(assistantId, new Set());
        }

        assistantUserCount.get(assistantId)?.add(userId);
      }
    });

    // Get statistics for each user
    const userStats = await Promise.all(
      users.map(async (user) => {
        try {
          // Get actions count and last action
          const actions = await Action.find({ userId: user.clerkUserId })
            .sort({ createdAt: -1 })
            .lean()
            .catch(() => []);

          // Get goals with timestamps and calculate detailed stats
          const goals = await prisma.usergoals.findUnique({
            where: {
              userId: user.clerkUserId,
            },
          });

          // Get folders
          const folders = await Folder.find({ user: user.clerkUserId })
            .lean()
            .catch(() => []);

          // Get chats and aggregate assistant usage
          const chats = await Chat.find({ user: user.clerkUserId })
            .lean()
            .catch(() => []);

          // Calculate assistant usage
          const assistantUsage = new Map<string, number>();
          chats.forEach((chat) => {
            if (chat.assistant) {
              const count = assistantUsage.get(chat.assistant.toString()) || 0;
              assistantUsage.set(chat.assistant.toString(), count + 1);
            }
          });

          // Convert to array and sort by usage
          const sortedAssistants = Array.from(assistantUsage.entries())
            .map(([assistantId, count]) => {
              const assistant = assistantsMap.get(assistantId);
              const users = assistantUserCount.get(assistantId) || new Set();

              // An assistant is custom if it belongs to exactly one user
              const isCustom = users.size === 1 && users.has(user.clerkUserId);

              return {
                name: assistant?.name || "Unknown Assistant",
                useCount: count,
                user: isCustom ? user.clerkUserId : null,
                _id: assistantId,
              };
            })
            .sort((a, b) => b.useCount - a.useCount);

          const favoriteAssistant = sortedAssistants[0]?.name || null;
          const topAssistants = sortedAssistants.slice(0, 3);

          // Get question answers with timestamps
          const questionAnswers = await QuestionAnswer.find({ user: user._id })
            .sort({ updatedAt: -1 })
            .limit(1)
            .lean()
            .catch(() => []);

          // Get Clerk user data
          const clerkUser = clerkUsersMap.get(user.clerkUserId);
          const lastLoginDate = clerkUser?.lastSignInAt || null;

          // Calculate date ranges
          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);

          // Initialize login counts
          let loginCount = {
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
          };

          // If we have Clerk user data, calculate login counts
          if (clerkUser?.lastSignInAt) {
            const lastSignIn = new Date(clerkUser.lastSignInAt);

            // Check today's login
            if (lastSignIn >= today) {
              loginCount.today = 1;
            }

            // Check this week's login (including today)
            if (lastSignIn >= weekAgo) {
              loginCount.thisWeek = 1;
            }

            // Check this month's login (including this week)
            if (lastSignIn >= monthAgo) {
              loginCount.thisMonth = 1;
            }
          }

          // Safely access timestamps
          const lastAction = actions[0];
          const lastQuestionAnswer = questionAnswers[0];

          // Calculate goal statistics
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
          startOfWeek.setHours(0, 0, 0, 0);

          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          const goalStats: GoalStats = {
            activeWeekly:
              goals?.weeklyGoals?.filter((goal) => !goal.isCompleted)?.length ||
              0,
            activeMonthly:
              goals?.monthlyGoals?.filter((goal) => !goal.isCompleted)
                ?.length || 0,
            completedThisWeek:
              goals?.weeklyGoals?.filter((goal) => {
                if (!goal.completedAt) return false;
                const completedDate = new Date(goal.completedAt);
                return completedDate >= startOfWeek && completedDate <= now;
              })?.length || 0,
            completedThisMonth:
              goals?.monthlyGoals?.filter((goal) => {
                if (!goal.completedAt) return false;
                const completedDate = new Date(goal.completedAt);
                return completedDate >= startOfMonth && completedDate <= now;
              })?.length || 0,
          };

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            actionsCount: actions.length,
            lastActionDate: lastAction
              ? safeISOString(lastAction.createdAt)
              : null,
            goalsCount:
              (goals?.weeklyGoals?.length || 0) +
              (goals?.monthlyGoals?.length || 0),
            goalStats,
            lastGoalDate: goals?.updatedAt
              ? safeISOString(goals.updatedAt)
              : null,
            foldersCount: folders.length,
            customAiUsage: chats.some((chat) => chat.assistant),
            lastQuestionAnswerUpdate: lastQuestionAnswer?.updatedAt
              ? safeISOString(lastQuestionAnswer.updatedAt)
              : null,
            chatsCount: chats.length,
            lastLoginDate,
            loginCount,
            favoriteAssistant,
            topAssistants,
          };
        } catch (err) {
          console.error(`Error processing user ${user._id}:`, err);
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            actionsCount: 0,
            lastActionDate: null,
            goalsCount: 0,
            goalStats: {
              activeWeekly: 0,
              activeMonthly: 0,
              completedThisWeek: 0,
              completedThisMonth: 0,
            },
            lastGoalDate: null,
            foldersCount: 0,
            customAiUsage: false,
            lastQuestionAnswerUpdate: null,
            chatsCount: 0,
            lastLoginDate: null,
            loginCount: { today: 0, thisWeek: 0, thisMonth: 0 },
            favoriteAssistant: null,
            topAssistants: [],
          };
        }
      })
    );

    // Calculate total goal statistics for the dashboard
    const totalGoalStats = userStats.reduce(
      (acc, user) => ({
        activeWeekly: acc.activeWeekly + user.goalStats.activeWeekly,
        activeMonthly: acc.activeMonthly + user.goalStats.activeMonthly,
        completedThisWeek:
          acc.completedThisWeek + user.goalStats.completedThisWeek,
        completedThisMonth:
          acc.completedThisMonth + user.goalStats.completedThisMonth,
      }),
      {
        activeWeekly: 0,
        activeMonthly: 0,
        completedThisWeek: 0,
        completedThisMonth: 0,
      }
    );

    res.status(200).json({
      users: userStats,
      totalGoalStats,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({
      message: "Server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
