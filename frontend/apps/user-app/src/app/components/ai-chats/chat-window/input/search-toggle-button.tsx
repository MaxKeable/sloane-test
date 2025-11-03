import React from "react";
import { FaGlobe } from "react-icons/fa";
import { Toggle } from "@repo/ui-kit/components/ui/toggle";

interface SearchToggleButtonProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const SearchToggleButton: React.FC<SearchToggleButtonProps> = ({
  isEnabled,
  onToggle,
}) => {
  return (
    <Toggle
      pressed={isEnabled}
      onPressedChange={() => onToggle()}
      className="border border-white rounded-full text-white data-[state=on]:text-accent-foreground hover:bg-white/40 hover:text-white/40 data-[state=on]:border-none"
      aria-label="Toggle web search"
    >
      <FaGlobe />
      Search
    </Toggle>
  );
};
