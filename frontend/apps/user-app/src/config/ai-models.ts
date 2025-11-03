/**
 * AI Model Configuration for Frontend
 * Defines available models for the model selector UI
 */

import { SiAnthropic, SiOpenai, SiGoogle } from "react-icons/si";
import { IconType } from "react-icons";

export type AIProvider = "anthropic" | "openai" | "google";

export interface AIModelConfig {
  id: string; // Model ID used in AI SDK
  name: string; // Display name
  provider: AIProvider;
  description: string; // Short description for UI
  icon: IconType; // React Icon component
}

/**
 * Available models for user selection
 */
export const AVAILABLE_MODELS: AIModelConfig[] = [
  // Anthropic Claude Models
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "Best for coding and complex agents",
    icon: SiAnthropic,
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    description: "Fast and cost-effective",
    icon: SiAnthropic,
  },

  // OpenAI GPT Models
  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "openai",
    description: "Latest flagship model with reasoning",
    icon: SiOpenai,
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "openai",
    description: "Efficient GPT-5 variant",
    icon: SiOpenai,
  },

  // Google Gemini Models
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Good balance of speed and quality",
    icon: SiGoogle,
  },
];

/**
 * Get models grouped by provider
 */
export function getModelsByProvider(): Record<AIProvider, AIModelConfig[]> {
  return {
    anthropic: AVAILABLE_MODELS.filter((m) => m.provider === "anthropic"),
    openai: AVAILABLE_MODELS.filter((m) => m.provider === "openai"),
    google: AVAILABLE_MODELS.filter((m) => m.provider === "google"),
  };
}

/**
 * Get model config by ID
 */
export function getModelConfig(modelId: string): AIModelConfig | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === modelId);
}

/**
 * Provider display names
 */
export const PROVIDER_NAMES: Record<AIProvider, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google",
};
