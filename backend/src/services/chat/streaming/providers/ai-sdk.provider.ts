
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { streamText, stepCountIs } from "ai";
import Config from "../../../../../models/config";
import { logger } from "../../../../../utils/logger";
import {
  IAIProvider,
  IStreamTransport,
  StreamingOptions,
  StreamingCallbacks,
  AIModel,
} from "../types";
import {
  getProviderFromModelId,
  validateModelId,
} from "../../../../config/ai-models";

export class AISdkProvider implements IAIProvider {
  /**
   * Get the appropriate AI model based on config or override
   * @param selectedModel Optional model ID to override config
   */
  private async getAIModel(selectedModel?: string): Promise<AIModel> {
    // If a specific model is selected, use it
    if (selectedModel) {
      if (!validateModelId(selectedModel)) {
        throw new Error(`Invalid model ID: ${selectedModel}`);
      }

      const provider = getProviderFromModelId(selectedModel);
      if (!provider) {
        throw new Error(`Unable to determine provider for model: ${selectedModel}`);
      }

      logger.info("Using selected model override", {
        selectedModel,
        provider,
      });

      switch (provider) {
        case "anthropic":
          return {
            service: "anthropic",
            model: anthropic(selectedModel),
          };
        case "openai":
          return {
            service: "openAi",
            model: openai(selectedModel),
          };
        case "google":
          return {
            service: "gemini",
            model: google(selectedModel),
          };
      }
    }

    // Fall back to config-based selection
    const aiConfig = await Config.findOne();
    const aiService = aiConfig?.aiService || "openAi";

    switch (aiService) {
      case "openAi":
        return {
          service: "openAi",
          model: openai("gpt-4o"),
        };
      case "anthropic":
        return {
          service: "anthropic",
          model: anthropic("claude-haiku-4-5-20251001"),
        };
      case "gemini":
        return {
          service: "gemini",
          model: google("gemini-2.0-flash-exp"),
        };
      case "deepseek":
        throw new Error("DeepSeek not yet supported with AI SDK");
      default:
        throw new Error(`Unsupported AI service: ${aiService}`);
    }
  }

  /**
   * Extract text from PDF base64 data
   */
  private async extractPdfText(base64Data: string): Promise<string> {
    try {
      const pdfParse = require("pdf-parse");
      const buffer = Buffer.from(base64Data, "base64");
      const data = await pdfParse(buffer);
      return data.text || "No text could be extracted from this PDF.";
    } catch (error) {
      logger.error("Error extracting PDF text:", error);
      return "Error: Could not extract text from PDF.";
    }
  }

  /**
   * Process file attachments and update messages
   */
  private async processFileAttachment(
    messages: any[],
    file: StreamingOptions["file"]
  ): Promise<void> {
    if (!file) return;

    const lastMessage = messages[messages.length - 1];

    if (file.mimeType === "application/pdf") {
      const pdfText = await this.extractPdfText(file.data);
      lastMessage.content = `Document Content:\n${pdfText}\n\nUser Question: ${lastMessage.content}`;
    } else if (file.mimeType.startsWith("image/")) {
      lastMessage.content = [
        { type: "text", text: lastMessage.content as string },
        {
          type: "image",
          image: `data:${file.mimeType};base64,${file.data}`,
        },
      ] as any;
    }
  }

  /**
   * Stream chat response
   */
  async stream(
    options: StreamingOptions,
    transport: IStreamTransport,
    callbacks: StreamingCallbacks
  ): Promise<void> {
    const {
      chatId,
      messages,
      systemPrompt,
      file,
      userId,
      assistantId,
      tools,
      selectedModel,
    } = options;

    try {
      const { service, model } = await this.getAIModel(selectedModel);

      logger.info("Starting AI SDK stream", {
        chatId,
        aiService: service,
        assistantId,
        hasFile: !!file,
        hasTools: !!tools,
        selectedModel: selectedModel || 'default',
      });

      const processedMessages = [...messages];
      await this.processFileAttachment(processedMessages, file);

      const result = streamText({
        model,
        system: systemPrompt,
        messages: processedMessages,
        temperature: 0.7,
        tools,
        stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-step tool use
      });

      let fullResponse = "";

      for await (const part of result.fullStream) {
        if (part.type === "text-delta") {
          fullResponse += part.text;
          transport.sendTextDelta(fullResponse);
        } else if (part.type === "tool-call") {
          const toolArgs = "input" in part ? part.input : (part as any).args;
          if (callbacks.onToolCall) {
            callbacks.onToolCall(part.toolName, toolArgs);
          }
          transport.sendToolCall(part.toolName, toolArgs);
        } else if (part.type === "tool-result") {
          const toolResult = "output" in part ? part.output : undefined;
          if (toolResult) {
            transport.sendToolResult(part.toolName, toolResult);
          }
        }
      }

      transport.sendStreamEnd(fullResponse);

      await callbacks.onComplete(fullResponse);

      logger.info("AI SDK stream completed", {
        chatId,
        responseLength: fullResponse.length,
      });
    } catch (error) {
      logger.error("Error in AI SDK streaming:", error);
      const err = error instanceof Error ? error : new Error("Unknown error");
      transport.sendError(err);
      if (callbacks.onError) {
        callbacks.onError(err);
      }
      throw error;
    }
  }
}

export const aiSdkProvider = new AISdkProvider();
