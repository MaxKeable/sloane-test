import express, { Request, Response } from "express";
import Assistant from "../../models/assistant";

const router = express.Router();

router.put("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const { display, prompt } = req.body;

	// Basic validation
	if (!display || !prompt) {
		return res
			.status(400)
			.json({ message: "Please provide all required fields" });
	}

	try {
		// Update the assistant document
		const updatedAssistant = await Assistant.findByIdAndUpdate(
			id,
			//* Update the "prompts" array with the data
			{ $push: { prompts: { display, prompt } } },
			{ new: true },
		);

		if (!updatedAssistant) {
			return res.status(404).json({ message: "Assistant not found" });
		}

		// Send back the updated assistant
		res.status(200).json(updatedAssistant);
	} catch (error) {
		console.error("Error updating assistant:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
