import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { streamText, ModelMessage, stepCountIs } from "ai";
import { chatNamespace } from "../../../index";
import { logger } from "../../../utils/logger";
import Config from "../../../models/config";
import {
  getProviderFromModelId,
  validateModelId,
} from "../../config/ai-models";

interface StreamOptions {
  chatId: string;
  messages: ModelMessage[];
  systemPrompt: string;
  file?: {
    data: string; // base64
    mimeType: string;
    filename: string;
  };
  userId: string;
  assistantId?: string;
  tools?: Record<string, ReturnType<typeof import("ai").tool>>;
  onToolCall?: (toolName: string, args: any) => void;
  onComplete: (response: string) => Promise<void>;
  selectedModel?: string;
}

/**
 * Extract text from PDF base64 data
 */
async function extractPdfText(base64Data: string): Promise<string> {
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

async function getAIModel(selectedModel?: string) {
  if (selectedModel) {
    if (!validateModelId(selectedModel)) {
      throw new Error(`Invalid model ID: ${selectedModel}`);
    }

    const provider = getProviderFromModelId(selectedModel);
    if (!provider) {
      throw new Error(
        `Unable to determine provider for model: ${selectedModel}`
      );
    }

    logger.info("Using selected model override", {
      selectedModel,
      provider,
    });

    switch (provider) {
      case "anthropic":
        return anthropic(selectedModel);
      case "openai":
        return openai(selectedModel);
      case "google":
        return google(selectedModel);
    }
  }

  const aiConfig = await Config.findOne();
  const aiService = aiConfig?.aiService || "openAi";

  switch (aiService) {
    case "openAi":
      return openai("gpt-4o");
    case "anthropic":
      return anthropic("claude-haiku-4-5-20251001");
    case "gemini":
      return google("gemini-2.0-flash-exp");
    case "deepseek":
      throw new Error("DeepSeek not yet supported with AI SDK");
    default:
      throw new Error(`Unsupported AI service: ${aiService}`);
  }
}

export async function streamChatWithAISDK(
  options: StreamOptions
): Promise<void> {
  const {
    chatId,
    messages,
    systemPrompt,
    file,
    userId,
    assistantId,
    tools,
    onToolCall,
    onComplete,
    selectedModel,
  } = options;

  try {
    const model = await getAIModel(selectedModel);

    logger.info("Starting AI SDK chat stream", {
      chatId,
      assistantId,
      hasFile: !!file,
      hasTools: !!tools,
      selectedModel: selectedModel || "default",
    });

    const processedMessages = [...messages];

    if (file) {
      const lastMessage = processedMessages[processedMessages.length - 1];

      if (file.mimeType === "application/pdf") {
        const pdfText = await extractPdfText(file.data);
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

    const result = streamText({
      model,
      system: systemPrompt,
      messages: processedMessages,
      temperature: 0.7,
      tools,
      stopWhen: stepCountIs(5),
    });

    let fullResponse = "";

    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        fullResponse += part.text;
        chatNamespace.to(chatId).emit("chat:response", fullResponse);
      } else if (part.type === "tool-call") {
        const toolArgs = "input" in part ? part.input : (part as any).args;
        if (onToolCall) {
          onToolCall(part.toolName, toolArgs);
        }
        logger.info("Tool call in stream", {
          chatId,
          toolName: part.toolName,
          args: toolArgs,
        });
        chatNamespace.to(chatId).emit("chat:tool_call", {
          toolName: part.toolName,
          args: toolArgs,
        });
      } else if (part.type === "tool-result") {
        const toolResult = "output" in part ? part.output : undefined;
        logger.info("Tool result in stream", {
          chatId,
          toolName: part.toolName,
          resultPreview: toolResult
            ? typeof toolResult === "string"
              ? toolResult.substring(0, 200)
              : JSON.stringify(toolResult).substring(0, 200)
            : "No output",
        });
        if (toolResult) {
          chatNamespace.to(chatId).emit("chat:tool_result", {
            toolName: part.toolName,
            result: toolResult,
          });
        }
      }
    }

    chatNamespace.to(chatId).emit("chat:stream_end", fullResponse);

    await onComplete(fullResponse);

    logger.info("AI SDK chat stream completed", {
      chatId,
      responseLength: fullResponse.length,
    });
  } catch (error) {
    logger.error("Error in AI SDK chat streaming:", error);
    chatNamespace
      .to(chatId)
      .emit("chat:error", { message: "An error occurred during streaming" });
    throw error;
  }
}
