import { trpcClient } from "../utils/trpc-client.js";

interface GetLastChatResult {
  lastChat: string;
  [key: string]: unknown;
}

export const getLastChatTool = async (): Promise<GetLastChatResult> => {
  try {
    console.log("[getLastChatTool] Fetching last chat from tRPC...");

    const result = await trpcClient.getLastChat.query();

    console.log(
      "[getLastChatTool] Backend response received",
      `Type: ${typeof result}`,
      `Length: ${typeof result === "string" ? result.length : "N/A"}`
    );

    if (!result || (typeof result === "string" && result.trim().length === 0)) {
      throw new Error("Backend returned empty response");
    }

    const lastChat =
      typeof result === "string" ? result : JSON.stringify(result);

    console.log("[getLastChatTool] Successfully processed chat message");

    return { lastChat };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[getLastChatTool] Error:", errorMessage);
    throw new Error(`Failed to fetch last chat: ${errorMessage}`);
  }
};
