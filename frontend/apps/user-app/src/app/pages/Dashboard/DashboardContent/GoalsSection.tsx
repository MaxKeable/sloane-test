import { GoalsSection as GoalsSectionComponent } from "../Goals";
import { useGetGoals, useToggleGoal, useUpdateGoals } from "@/api/use-goal-api";

const GoalsSection = () => {
  const { data: userGoals } = useGetGoals();
  const updateGoals = useUpdateGoals();
  const { mutate: toggleGoal } = useToggleGoal();

  const handleSaveGoals = async (
    newWeeklyGoals: string[],
    newMonthlyGoals: string[]
  ) => {
    updateGoals.mutate({
      weeklyGoals: newWeeklyGoals,
      monthlyGoals: newMonthlyGoals,
    });
  };

  const handleToggleGoalComplete = async (
    goalId: string,
    type: "weekly" | "monthly"
  ) => {
    toggleGoal({ goalId, type });
  };

  return (
    <div className="col-span-2 md:col-span-3 lg:col-span-4">
      <GoalsSectionComponent
        weeklyGoals={userGoals?.weeklyGoals || []}
        monthlyGoals={userGoals?.monthlyGoals || []}
        isEnabled={userGoals?.isEnabled || false}
        onToggleGoalComplete={handleToggleGoalComplete}
        onSave={handleSaveGoals}
      />
    </div>
  );
};

export default GoalsSection;
