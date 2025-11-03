import { Goal } from "@backend/src/model/types";
import { FC, useState } from "react";
import { FaPencilAlt, FaTimes, FaCheck } from "react-icons/fa";

export type Props = {
  goal: Goal;
  type: "weekly" | "monthly";
  onToggleComplete: (goalId: string, type: "weekly" | "monthly") => void;
  onEdit: (
    goal: Goal,
    type: "weekly" | "monthly",
    previousTitle?: string
  ) => void;
  onDelete: (goalId: string, type: "weekly" | "monthly") => void;
};

const GoalItem: FC<Props> = ({
  goal,
  type,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal.title);

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onEdit({ ...goal, title: editValue.trim() }, type, goal.title);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditValue(goal.title);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 text-brand-cream border-b border-brand-cream/20 pb-2">
      <input
        type="checkbox"
        checked={goal.isCompleted}
        onChange={() => onToggleComplete(goal.title, type)}
        className="w-4 h-4 rounded border-brand-cream/50 text-brand-logo focus:ring-brand-logo/50 accent-brand-logo"
      />
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && editValue.trim()) {
                handleSaveEdit();
              }
            }}
            className="flex-1 bg-transparent border-b border-brand-cream text-brand-cream focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleSaveEdit}
            className="text-brand-logo hover:text-brand-logo/80"
          >
            <FaCheck />
          </button>
          <button
            onClick={handleCancelEdit}
            className="text-red-500 hover:text-red-400"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <>
          <span
            onClick={() => setIsEditing(true)}
            className={`flex-1 cursor-pointer ${
              goal.isCompleted ? "line-through text-brand-cream/50" : ""
            }`}
          >
            {goal.title}
          </span>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-xs bg-brand-cream/10 text-brand-cream hover:bg-brand-cream/20 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(goal.title, type)}
              className="px-2 py-1 text-xs bg-red-500/20 text-red-500 hover:bg-red-500/20 rounded"
            >
              Delete
            </button>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-brand-cream/50 hover:text-brand-cream"
            >
              <FaPencilAlt size={14} />
            </button>
            <button
              onClick={() => onDelete(goal.title, type)}
              className="text-red-500 hover:text-red-500"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GoalItem;
