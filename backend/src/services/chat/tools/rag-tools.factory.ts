import { tool } from "ai";
import { z } from "zod";
import {
  findRelevantContent,
  createResourceWithEmbeddings,
} from "../../../utils/embeddingService";
import { logger } from "../../../../utils/logger";
import { ToolFactoryOptions } from "./types";

export function createRagTools(
  options: ToolFactoryOptions,
  isolateToAssistant: boolean
) {
  const { userId, assistantId, callbacks } = options;

  const getInformationSchema = z.object({
    query: z
      .string()
      .describe("The search query or question to find relevant information"),
  });

  const getInformationTool = tool({
    description: `Retrieve existing information from the knowledge base to answer user questions. Use this BEFORE responding when the question relates to previously stored business information, company details, processes, or past conversations. This helps provide accurate, context-aware responses based on stored knowledge.`,
    inputSchema: getInformationSchema,
    execute: async ({ query }) => {
      try {
        console.log("query calling get embedding info", query);
        if (callbacks?.onToolCall) {
          callbacks.onToolCall("getInformation", { query });
        }

        logger.info("RAG tool: getInformation", {
          userId,
          assistantId,
          isolateToAssistant,
          query,
        });

        const results = await findRelevantContent(
          query,
          userId,
          assistantId || undefined,
          isolateToAssistant,
          5
        );

        if (results.length === 0) {
          return "No relevant information found in knowledge base.";
        }

        return results
          .map(
            (r, i) =>
              `[Result ${i + 1}] (similarity: ${r.similarity.toFixed(2)})\n${r.content}`
          )
          .join("\n\n");
      } catch (error) {
        logger.error("Error in getInformation tool:", error);
        return "Error searching knowledge base. Please try again.";
      }
    },
  });

  const addResourceSchema = z.object({
    content: z.string().describe("The information to add to knowledge base"),
    title: z.string().describe("Optional title for this resource").optional(),
  });

  const getAddResourceTool = tool({
    description: `Store new factual business information in the knowledge base. Use IMMEDIATELY when user shares: employee count, office locations, product launches, revenue milestones, company announcements, policies, processes, customer info, or any declarative business facts. REQUIRED when statements contain "I have", "We are", "I now", "We just", "We moved", etc. Store facts BEFORE answering questions.`,
    inputSchema: addResourceSchema,
    execute: async ({ content, title }) => {
      try {
        console.log("content calling add resource", content);
        if (callbacks?.onToolCall) {
          callbacks.onToolCall("addResource", { content, title });
        }

        logger.info("RAG tool: addResource", {
          userId,
          assistantId,
          isolateToAssistant,
          title,
          contentLength: content.length,
        });

        await createResourceWithEmbeddings(
          content,
          userId,
          assistantId || undefined,
          {
            title,
            type: "text",
          }
        );

        return `Successfully added to knowledge base${title ? `: "${title}"` : ""}`;
      } catch (error) {
        logger.error("Error in addResource tool:", error);
        return "Error adding to knowledge base. Please try again.";
      }
    },
  });

  return {
    getInformation: getInformationTool,
    addResource: getAddResourceTool,
  };
}
