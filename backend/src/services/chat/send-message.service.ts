import { executeChatPipeline } from "./pipeline";
import type { SendMessageInput } from "./pipeline/types";

export async function sendMessage(userId: string, input: SendMessageInput) {
  return executeChatPipeline(userId, input);
}
