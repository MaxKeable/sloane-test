import { Request, Response } from "express";
import Assistant from "../../models/assistant";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";
import generateAssistantPrompt from "../../utils/generateAssistantPrompt";

export const createAssistant = async (req: Request, res: Response) => {
	try {
		const userId = await getUserIdFromBearer(req);

		// Verify user is admin
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { name, image, description, basePrompt, prompts, user } = req.body;

		// Validate required fields
		if (!name || !image || !description || !basePrompt) {
			return res.status(400).json({
				message: "Missing required fields",
			});
		}

		// Generate AI-enhanced prompt from user's input
		const enhancedPrompt = await generateAssistantPrompt(basePrompt);

		// Create new assistant with enhanced prompt
		const assistant = new Assistant({
			name,
			image,
			description,
			jobTitle: name,
			basePrompt: enhancedPrompt, // Use the AI-generated prompt
			prompts: prompts || [],
			user: user || userId, // Use the provided user ID or the authenticated user's ID
			relatedAssistants: [], // Initialize empty array
		});

		// Save to database
		await assistant.save();

		res.status(201).json(assistant);
	} catch (error) {
		console.error("Error creating assistant:", error);
		res.status(500).json({
			message: "Error creating assistant",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
