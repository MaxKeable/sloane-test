import { ReactNode } from 'react';

export interface GoalStats {
  activeWeekly: number;
  activeMonthly: number;
  completedThisWeek: number;
  completedThisMonth: number;
}

export interface UserStats {
  id: string;
  name: string;
  email: string;
  actionsCount: number;
  lastActionDate: string | null;
  goalsCount: number;
  goalStats: GoalStats;
  weeklyGoals: Array<{
    title: string;
    isCompleted: boolean;
  }>;
  monthlyGoals: Array<{
    title: string;
    isCompleted: boolean;
  }>;
  lastGoalDate: string | null;
  foldersCount: number;
  customAiUsage: boolean;
  lastQuestionAnswerUpdate: string | null;
  chatsCount: number;
  lastLoginDate: string | null;
  loginCount: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  favoriteAssistant: string | null;
  topAssistants: Array<{
    name: string;
    user: string;
    _id: string;
    useCount: number;
  }>;
}

export interface StatItemProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  lastUpdate?: string | null;
} 