import { FC } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Goal } from "@backend/src/model/types";

export interface Props {
  isEnabled: boolean;
  onToggleGoals?: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  weeklyGoals: Goal[];
  monthlyGoals: Goal[];
}

const renderGoalIcons = (goals: Props["weeklyGoals"]) => {
  return goals.map((goal, index) => (
    <div
      key={index}
      className={`w-6 h-6 rounded-full border ${
        goal.isCompleted
          ? "bg-brand-logo border-brand-logo"
          : "border-brand-cream/50"
      }`}
    />
  ));
};

const GoalHeader: FC<Props> = ({
  isEnabled,
  onToggleGoals,
  isExpanded,
  onToggleExpand,
  weeklyGoals,
  monthlyGoals,
}) => {
  return (
    <>
      <div className="flex sm:hidden items-center justify-between pt-3">
        <div className="flex flex-col">
          <span className="text-brand-cream text-sm font-medium">
            Goal Tracking
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 text-brand-cream hover:text-brand-orange-cream transition-colors"
          >
            <span className="text-sm font-medium">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
            {isExpanded ? (
              <FaChevronUp size={14} />
            ) : (
              <FaChevronDown size={14} />
            )}
          </button>
        </div>
      </div>

      <div className="hidden sm:flex sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pt-3">
        <div className="flex flex-col">
          <span className="text-brand-cream text-sm font-medium">
            Goal Tracking
          </span>
          <span className="text-brand-cream/60 text-[14px]">
            Track your progress
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-brand-cream text-sm font-medium min-w-[60px]">
              Weekly
            </span>
            <div className="flex space-x-2">{renderGoalIcons(weeklyGoals)}</div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-brand-cream text-sm font-medium min-w-[60px]">
              Monthly
            </span>
            <div className="flex space-x-2">
              {renderGoalIcons(monthlyGoals)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 text-brand-cream hover:text-brand-orange-cream transition-colors"
          >
            <span className="text-sm font-medium">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
            {isExpanded ? (
              <FaChevronUp size={14} />
            ) : (
              <FaChevronDown size={14} />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default GoalHeader;
