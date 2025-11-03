import { Request, Response } from "express";
import generateAssistantPrompt from "../../utils/generateAssistantPrompt";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

export const generatePrompt = async (req: Request, res: Response) => {
	try {
		const userId = await getUserIdFromBearer(req);
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { userInput } = req.body;
		if (!userInput) {
			return res.status(400).json({ message: "User input is required" });
		}

		const generatedPrompt = await generateAssistantPrompt(userInput);
		res.json({ prompt: generatedPrompt });
	} catch (error) {
		console.error("Error in generate prompt endpoint:", error);
		res.status(500).json({
			message: "Error generating prompt",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
