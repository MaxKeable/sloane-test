import { Tool } from "ai";
import { z } from "zod";
import { searchWeb } from "../../web-search/serper.service";
import { logger } from "../../../../utils/logger";
import { ToolFactoryOptions } from "./types";

export function createWebSearchTools(options: ToolFactoryOptions) {
  const { userId, assistantId, callbacks } = options;

  const searchWebSchema = z.object({
    query: z
      .string()
      .describe(
        "The search query. Be specific and concise to get better results."
      ),
    numResults: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe("Number of results to return (1-10, default: 5)")
      .optional(),
  });

  type SearchWebParams = z.infer<typeof searchWebSchema>;

  const searchWebTool: Tool<SearchWebParams, string> = {
    description: `Search the web for real-time, current information. REQUIRED when user asks about: stock prices, weather, current events, news, "latest" anything, "today", "now", "right now", "this week/month/year", "best X right now", recent statistics, product reviews, market data, sports scores, or explicitly says "search". MUST use for any time-sensitive or current data queries. Do NOT answer from training data when current information is requested.`,
    inputSchema: searchWebSchema as any,
    execute: async (args: SearchWebParams): Promise<string> => {
      const { query, numResults = 5 } = args;

      try {
        if (callbacks?.onToolCall) {
          callbacks.onToolCall("searchWeb", {
            query,
            numResults,
          });
        }

        logger.info("Web search tool: searchWeb", {
          userId,
          assistantId,
          query,
          numResults,
        });

        const results = await searchWeb(query, { numResults });

        if (results.length === 0) {
          return "No results found for this search query.";
        }

        const formattedResults = results
          .map((result, index) => {
            let formatted = `[${index + 1}] ${result.title}\n`;
            formatted += `URL: ${result.link}\n`;
            formatted += `${result.snippet}`;
            if (result.date) {
              formatted += `\nDate: ${result.date}`;
            }
            return formatted;
          })
          .join("\n\n---\n\n");

        return `Web search results for "${query}":\n\n${formattedResults}\n\nNote: Always cite sources by including the URL when using this information.`;
      } catch (error) {
        logger.error("Error in searchWeb tool:", error);
        return "Error performing web search. The search service may be unavailable.";
      }
    },
  };

  return {
    searchWeb: searchWebTool,
  };
}
