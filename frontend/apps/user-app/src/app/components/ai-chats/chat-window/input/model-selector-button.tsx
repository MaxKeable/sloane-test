import React, { forwardRef } from "react";
import { Button } from "@repo/ui-kit/components/ui/button";
import { FaChevronUp, FaMicrochip } from "react-icons/fa";
import { getModelConfig } from "../../../../../config/ai-models";

interface ModelSelectorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selectedModel: string | null;
  isOpen: boolean;
  onToggle?: () => void;
}

export const ModelSelectorButton = forwardRef<HTMLButtonElement, ModelSelectorButtonProps>(
  ({ selectedModel, isOpen, onToggle, className, onClick, ...rest }, ref) => {
    const modelConfig = selectedModel ? getModelConfig(selectedModel) : null;

    const displayText = modelConfig ? modelConfig.name : "Select Model";
    const Icon = modelConfig ? modelConfig.icon : FaMicrochip;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      onClick?.(e);
      onToggle?.();
    };

    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        onClick={handleClick}
        className={`border border-white rounded-full text-white hover:bg-white/40 hover:text-white flex items-center gap-2 px-3 py-2 text-sm ${className ?? ""}`}
        aria-label="Select AI Model"
        {...rest}
      >
        <Icon className="w-4 h-4" />
        <span className="whitespace-nowrap">{displayText}</span>
        <FaChevronUp
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>
    );
  }
);

ModelSelectorButton.displayName = "ModelSelectorButton";
