/***************************************************************
                NOTES
***************************************************************/
/*
- Contains all types for the Goals feature
- Follows TypeScript best practices
- Maintains single responsibility principle
*/

export interface Goal {
  title: string;
  isCompleted: boolean;
  _id: string;
}

export interface GoalControlsProps {
  isEnabled: boolean;
  onToggleGoals: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}
