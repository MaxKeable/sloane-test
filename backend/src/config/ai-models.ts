export type AIProvider = "anthropic" | "openai" | "google";

export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
}

export const AVAILABLE_MODELS: AIModelConfig[] = [
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "Best for coding and complex agents",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    description: "Fast and cost-effective",
  },

  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "openai",
    description: "Latest flagship model with reasoning",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "openai",
    description: "Efficient GPT-5 variant",
  },

  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Good balance of speed and quality",
  },
];

export function getProviderFromModelId(
  modelId: string
): AIProvider | undefined {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
  return model?.provider;
}

export function validateModelId(modelId: string): boolean {
  return AVAILABLE_MODELS.some((m) => m.id === modelId);
}

export function getModelConfig(modelId: string): AIModelConfig | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === modelId);
}
