import { FC, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import GoalItem from "./GoalItem";
import { Goal } from "@backend/src/model/types";

export type Props = {
  goals: Goal[];
  type: "weekly" | "monthly";
  onToggleComplete: (goalId: string, type: "weekly" | "monthly") => void;
  onEdit: (goal: Goal, type: "weekly" | "monthly") => void;
  onDelete: (goalId: string, type: "weekly" | "monthly") => void;
  onClear: () => void;
};

const GoalList: FC<Props> = ({
  goals,
  type,
  onToggleComplete,
  onEdit,
  onDelete,
  onClear,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newGoalValue, setNewGoalValue] = useState("");

  const handleAddNewGoal = () => {
    setIsAddingNew(true);
    setNewGoalValue("");
  };

  const handleSaveNewGoal = () => {
    if (newGoalValue.trim()) {
      onEdit(
        {
          createdAt: new Date(),
          title: newGoalValue.trim(),
          isCompleted: false,
        },
        type
      );
      setNewGoalValue("");
      setIsAddingNew(true);
    }
  };

  const handleCancelNewGoal = () => {
    setIsAddingNew(false);
    setNewGoalValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveNewGoal();
    }
  };

  return (
    <div>
      <h3 className="text-brand-cream text-sm mb-2">
        {type === "weekly" ? "Weekly" : "Monthly"} Goals
      </h3>
      <div className="space-y-2">
        {goals.map((goal) => (
          <GoalItem
            key={goal.title}
            goal={goal}
            type={type}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {goals.length < 5 && !isAddingNew && (
          <button
            onClick={handleAddNewGoal}
            className="flex items-center gap-2 text-brand-cream/50 hover:text-brand-cream text-sm mt-2"
          >
            <FaPlus size={12} />
            <span>Add another goal</span>
          </button>
        )}
        {goals.length >= 5 && (
          <div className="text-brand-cream/60 text-xs mt-2 p-2 bg-brand-cream/5 rounded">
            ✨ You've created 5 goals! The intention here is to keep it simple
            and focused. For longer lists, we suggest creating a task in the
            Action Plan with a checklist instead.
          </div>
        )}
        {isAddingNew && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={newGoalValue}
              onChange={(e) => setNewGoalValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent border-b border-brand-cream text-brand-cream focus:outline-none"
              placeholder="Enter new goal"
              autoFocus
            />
            <button
              onClick={handleSaveNewGoal}
              className="text-brand-logo hover:text-brand-logo/80"
            >
              <FaPlus />
            </button>
            <button
              onClick={handleCancelNewGoal}
              className="text-red-500 hover:text-red-400"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm bg-brand-cream/10 text-brand-cream/70 hover:bg-brand-cream/20 rounded flex items-center gap-2"
        >
          <FaTrash size={12} />
          Clear {type === "weekly" ? "Weekly" : "Monthly"} Goals
        </button>
      </div>
    </div>
  );
};

export default GoalList;
