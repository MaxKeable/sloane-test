import { trpcClient } from "../utils/trpc-client.js";

interface GetBusinessContextResult {
  businessContext: string;
  [key: string]: unknown;
}

export const getBusinessContextTool =
  async (): Promise<GetBusinessContextResult> => {
    try {
      console.log("[getBusinessContextTool] Fetching business context...");

      const result = await trpcClient.getBusinessContext.query();

      return { businessContext: result };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("[getBusinessContextTool] Error:", errorMessage);
      throw new Error(`Failed to get business context: ${errorMessage}`);
    }
  };
