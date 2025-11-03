import OpenAI from "openai";
import prisma from "../../../../../config/client";
import { logger } from "../../../../../utils/logger";
import { createResourceWithEmbeddings } from "../../../../utils/embeddingService";
import { PipelineContext, PipelineStep } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

interface ExtractedContext {
  currentTopic: string | null;
  keyDecisions: string[];
  isImportant: boolean;
  summary?: string;
}

/**
 * Extract context from the conversation using AI
 * Extracts: current topic, key decisions, and determines if worth storing in RAG
 */
async function extractContextWithAI(
  question: string,
  answer: string,
  previousTopic?: string | null
): Promise<ExtractedContext> {
  try {
    const extractionPrompt = `You are a context extraction system. Analyze the following conversation exchange and extract:
1. The current topic of discussion (1 short sentence, max 80 characters)
2. Any key decisions, conclusions, or important facts mentioned (as a list)
3. Whether this exchange contains important information worth remembering long-term

Previous topic: ${previousTopic || "None"}

User question: "${question}"
Assistant answer: "${answer}"

Return your response in this EXACT JSON format:
{
  "currentTopic": "brief description of what they're discussing now",
  "keyDecisions": ["decision 1", "decision 2", ...],
  "isImportant": true/false,
  "summary": "brief summary if important (optional)"
}

Rules:
- currentTopic should be a concise summary (max 80 chars)
- Only include keyDecisions if there are actual decisions, conclusions, or important facts
- Return empty array for keyDecisions if nothing notable
- isImportant should be true ONLY if the exchange contains:
  * Important business decisions or conclusions
  * Key facts about the user's business, project, or goals
  * Critical information that would be valuable later in the conversation
- isImportant should be false for:
  * Casual conversation, greetings, general questions
  * Information that is temporary or not worth long-term storage
- If isImportant is true, provide a brief summary of why it's important
- If the topic hasn't changed significantly from previous topic, use the previous topic`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cheap for extraction
      messages: [
        { role: "system", content: "You are a context extraction assistant. Always respond with valid JSON only." },
        { role: "user", content: extractionPrompt },
      ],
      temperature: 0.3, // Low temperature for consistent extraction
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { currentTopic: null, keyDecisions: [], isImportant: false };
    }

    const parsed = JSON.parse(content) as ExtractedContext;
    return {
      currentTopic: parsed.currentTopic || null,
      keyDecisions: Array.isArray(parsed.keyDecisions) ? parsed.keyDecisions : [],
      isImportant: parsed.isImportant || false,
      summary: parsed.summary,
    };
  } catch (error) {
    logger.error("Error extracting context with AI:", error);
    return { currentTopic: null, keyDecisions: [], isImportant: false };
  }
}

/**
 * Pipeline step: Extract and store session context
 * Runs after the chat response is generated
 */
export const extractContextStep: PipelineStep = async (
  context: PipelineContext
): Promise<PipelineContext> => {
  if (!context.chat || !context.response) {
    // Skip if no chat or response available
    return context;
  }

  try {
    const lastMessage = context.chat.messages[context.chat.messages.length - 1];
    const userMessage = context.input.message;
    const assistantResponse = context.response;

    // Only extract context if the message is substantial
    const messageLength = userMessage.length + assistantResponse.length;
    if (messageLength < 50) {
      logger.info("Pipeline Step: Extract Context - Skipping (message too short)");
      return context;
    }

    logger.info("Pipeline Step: Extract Context", {
      chatId: context.input.chatId,
      messageLength,
    });

    // Get previous topic from chat's session context
    const previousTopic = context.chat.sessionContext?.currentTopic || null;

    // Extract context using AI
    const extracted = await extractContextWithAI(
      userMessage,
      assistantResponse,
      previousTopic
    );

    // Update chat's session context in database
    if (extracted.currentTopic || extracted.keyDecisions.length > 0) {
      const currentSessionContext = context.chat.sessionContext || {
        currentTopic: null,
        keyDecisions: [],
        lastUpdated: new Date(),
      };

      const updatedContext = {
        currentTopic: extracted.currentTopic || currentSessionContext.currentTopic,
        keyDecisions: [
          ...currentSessionContext.keyDecisions,
          ...extracted.keyDecisions,
        ].slice(-10), // Keep last 10 decisions max
        lastUpdated: new Date(),
      };

      await prisma.chats.update({
        where: { id: context.input.chatId },
        data: { sessionContext: updatedContext },
      });

      logger.info("Session context updated", {
        chatId: context.input.chatId,
        topic: updatedContext.currentTopic,
        decisionsCount: updatedContext.keyDecisions.length,
      });
    }

    // Store important messages in RAG for future semantic retrieval
    if (extracted.isImportant) {
      try {
        const contentToStore = extracted.summary
          ? `Q: ${userMessage}\nA: ${extracted.summary}`
          : `Q: ${userMessage}\nA: ${assistantResponse}`;

        await createResourceWithEmbeddings(
          contentToStore,
          context.userId,
          context.chat.assistant || undefined,
          {
            title: extracted.currentTopic || "Chat context",
            type: "chat_context",
            chatId: context.input.chatId,
            source: "auto-extracted",
          }
        );

        logger.info("Important message stored in RAG", {
          chatId: context.input.chatId,
          topic: extracted.currentTopic,
        });
      } catch (error) {
        logger.error("Error storing message in RAG:", error);
        // Don't fail the pipeline if RAG storage fails
      }
    }

    return context;
  } catch (error) {
    logger.error("Error in extract context step:", error);
    // Don't fail the pipeline if extraction fails
    return context;
  }
};
