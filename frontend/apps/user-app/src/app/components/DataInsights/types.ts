import { ReactNode, JSX } from "react";

export interface UserStats {
  id: string;
  name: string;
  email: string;
  actionsCount: number;
  lastActionDate: string | null;
  goalsCount: number;
  lastGoalDate: string | null;
  foldersCount: number;
  customAiUsage: boolean;
  lastQuestionAnswerUpdate: string | null;
  chatsCount: number;
}

export interface StatItemProps {
  label: string;
  value: string | number;
  icon?: JSX.Element;
  lastUpdate?: string | null;
}
