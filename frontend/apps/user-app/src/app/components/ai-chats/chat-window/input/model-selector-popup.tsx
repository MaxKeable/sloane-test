import React from "react";
import {
  getModelsByProvider,
  PROVIDER_NAMES,
  AIModelConfig,
  AIProvider,
} from "../../../../../config/ai-models";
import { Button } from "@repo/ui-kit/components/ui/button";

interface ModelSelectorPopupProps {
  isOpen: boolean;
  onSelect: (modelId: string | null) => void;
  selectedModel: string | null;
}

export const ModelSelectorPopup: React.FC<ModelSelectorPopupProps> = ({
  isOpen,
  onSelect,
  selectedModel,
}) => {
  if (!isOpen) return null;

  const modelsByProvider = getModelsByProvider();
  const providers: AIProvider[] = ["anthropic", "openai", "google"];

  const handleSelect = (modelId: string) => {
    onSelect(modelId);
  };

  const handleClearSelection = () => {
    onSelect(null);
  };

  return (
    <div className="p-2 bg-brand-green">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Select AI Model
        </h3>
        {selectedModel && (
          <Button
            variant="secondary"
            size={"sm"}
            onClick={handleClearSelection}
          >
            Use Default
          </Button>
        )}
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {providers.map((provider) => {
          const models = modelsByProvider[provider];
          if (models.length === 0) return null;

          return (
            <div key={provider}>
              <h4 className="text-xs font-medium text-white uppercase tracking-wide mb-2">
                {PROVIDER_NAMES[provider]}
              </h4>
              <div className="space-y-1">
                {models.map((model) => (
                  <ModelOption
                    key={model.id}
                    model={model}
                    isSelected={selectedModel === model.id}
                    onSelect={() => handleSelect(model.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ModelOptionProps {
  model: AIModelConfig;
  isSelected: boolean;
  onSelect: () => void;
}

const ModelOption: React.FC<ModelOptionProps> = ({
  model,
  isSelected,
  onSelect,
}) => {
  const Icon = model.icon;

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
        isSelected
          ? "bg-white/20 border-2 border-transparent hover:bg-white/20"
          : "bg-white/5 border-2 border-transparent hover:bg-white/20"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {model.name}
          </span>
          {isSelected && (
            <span className="text-xs text-accent">✓ Selected</span>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          {model.description}
        </p>
      </div>
    </button>
  );
};
