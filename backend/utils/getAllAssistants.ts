import Assistant from "../models/assistant"; // Adjust the path as necessary to where your Assistant model is defined
import { IAssistant } from "../types/interfaces";

/**
 * Retrieves all assistants from the database that are either public (no user) or belong to the specified user.
 * @param userId - The ID of the logged-in user
 * @returns A promise that resolves to an array of assistant documents with only name, image, description, jobTitle, and _id fields.
 */
export const getAllAssistants = async (
  userId: string | null
): Promise<IAssistant[]> => {
  try {
    // Create a query that matches either no user or the specified user
    const query = {
      $or: [{ user: { $exists: false } }, { user: null }, { user: userId }],
    };

    const assistants = await Assistant.find(query).select(
      "name image description jobTitle _id user prompts basePrompt"
    );

    return assistants.map((assistant) => ({
      ...assistant.toObject(),
      _id: assistant._id.toString(),
      user: assistant.user?.toString() ?? undefined,
    }));
  } catch (error) {
    console.error("Error retrieving assistants from the database:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
