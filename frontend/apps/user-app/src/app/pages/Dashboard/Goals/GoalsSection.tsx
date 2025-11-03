import { FC, useState } from "react";
import GoalHeader from "./GoalHeader";
import GoalList from "./GoalList";
import { useGoalToast } from "./Toasts/useGoalToast";
import { Goal } from "@backend/src/model/types";

type Props = {
  weeklyGoals: Goal[];
  monthlyGoals: Goal[];
  isEnabled: boolean;
  onToggleGoalComplete: (goalId: string, type: "weekly" | "monthly") => void;
  onSave: (weeklyGoals: string[], monthlyGoals: string[]) => void;
};

const GoalsSection: FC<Props> = ({
  weeklyGoals,
  monthlyGoals,
  isEnabled,
  onToggleGoalComplete,
  onSave,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    showGoalAddedToast,
    showGoalUpdatedToast,
    showGoalDeletedToast,
    showGoalsClearedToast,
    showMonthlyGoalsClearedToast,
  } = useGoalToast();
  const handleEditGoal = (
    goal: Props["weeklyGoals"][0],
    type: "weekly" | "monthly",
    previousTitle?: string
  ) => {
    const updatedWeeklyGoals = weeklyGoals.map((g) => g.title);
    const updatedMonthlyGoals = monthlyGoals.map((g) => g.title);

    if (type === "weekly") {
      const index = weeklyGoals.findIndex(
        (g) => g.title === (previousTitle ?? goal.title)
      );
      if (index !== -1) {
        updatedWeeklyGoals[index] = goal.title;
      } else {
        updatedWeeklyGoals.push(goal.title);
      }
    } else {
      const index = monthlyGoals.findIndex(
        (g) => g.title === (previousTitle ?? goal.title)
      );
      if (index !== -1) {
        updatedMonthlyGoals[index] = goal.title;
      } else {
        updatedMonthlyGoals.push(goal.title);
      }
    }

    onSave(updatedWeeklyGoals, updatedMonthlyGoals);

    const existedBefore =
      weeklyGoals.some((g) => g.title === (previousTitle ?? goal.title)) ||
      monthlyGoals.some((g) => g.title === (previousTitle ?? goal.title));

    if (existedBefore) {
      showGoalUpdatedToast();
    } else {
      showGoalAddedToast();
    }
  };

  const handleDeleteGoal = (goalId: string, type: "weekly" | "monthly") => {
    const updatedWeeklyGoals = weeklyGoals.map((g) => g.title);
    const updatedMonthlyGoals = monthlyGoals.map((g) => g.title);

    if (type === "weekly") {
      const index = weeklyGoals.findIndex((g) => g.title === goalId);
      if (index !== -1) {
        updatedWeeklyGoals.splice(index, 1);
      }
    } else {
      const index = monthlyGoals.findIndex((g) => g.title === goalId);
      if (index !== -1) {
        updatedMonthlyGoals.splice(index, 1);
      }
    }

    onSave(updatedWeeklyGoals, updatedMonthlyGoals);
    showGoalDeletedToast();
  };

  const handleClearGoals = (type: "weekly" | "monthly") => {
    if (type === "weekly") {
      onSave(
        [],
        monthlyGoals.map((g) => g.title)
      );
      showGoalsClearedToast();
    } else {
      onSave(
        weeklyGoals.map((g) => g.title),
        []
      );
      showMonthlyGoalsClearedToast();
    }
  };

  return (
    <div className="bg-brand-green-dark/50 rounded-lg px-4 mb-8 shadow-lg pb-4 pt-4 lg:pt-0">
      <div className="flex flex-col space-y-4">
        <GoalHeader
          isEnabled={isEnabled}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          weeklyGoals={weeklyGoals}
          monthlyGoals={monthlyGoals}
        />

        {isExpanded && (
          <>
            <div className="h-px bg-brand-cream/10 w-full" />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <GoalList
                goals={weeklyGoals}
                type="weekly"
                onToggleComplete={onToggleGoalComplete}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onClear={() => handleClearGoals("weekly")}
              />
              <GoalList
                goals={monthlyGoals}
                type="monthly"
                onToggleComplete={onToggleGoalComplete}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onClear={() => handleClearGoals("monthly")}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoalsSection;
