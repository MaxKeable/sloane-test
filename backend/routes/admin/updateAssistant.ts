import express, { Request, Response } from "express";
import Assistant from "../../models/assistant";
import generateAssistantPrompt from "../../utils/generateAssistantPrompt";

const router = express.Router();

/**
 * @swagger
 * /api/admin/update-assistant/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update an assistant
 *     description: Updates the details of an existing assistant. All fields are required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assistant's id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               basePrompt:
 *                 type: string
 *             required:
 *               - name
 *               - image
 *               - description
 *               - jobTitle
 *               - basePrompt
 *     responses:
 *       200:
 *         description: The assistant was successfully updated.
 *       400:
 *         description: Missing required fields or invalid data.
 *       404:
 *         description: Assistant not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, image, description, jobTitle, basePrompt, relatedAssistants, prompts, user } =
		req.body;

	// Debug logs
	console.log("Received update request with data:", {
		id,
		basePrompt,
		prompts: prompts?.length || 0
	});

	// Basic validation
	if (!name || !image || !description || !jobTitle || !basePrompt) {
		return res
			.status(400)
			.json({ message: "Please provide all required fields" });
	}

	try {
		// Generate AI-enhanced prompt from user's input, just like in createAssistant
		const enhancedPrompt = await generateAssistantPrompt(basePrompt);
		console.log("Generated enhanced prompt:", enhancedPrompt);

		// Log the update operation details
		console.log("Updating assistant with fields:", { 
			name, 
			image, 
			description, 
			jobTitle, 
			basePrompt: enhancedPrompt, // Use the enhanced prompt
			relatedAssistants: relatedAssistants?.length || 0,
			prompts: prompts?.length || 0,
			user
		});

		// Update the assistant document
		const updatedAssistant = await Assistant.findByIdAndUpdate(
			id,
			{ 
				name, 
				image, 
				description, 
				jobTitle, 
				basePrompt: enhancedPrompt, // Use the enhanced prompt
				relatedAssistants,
				prompts,
				user
			},
			{ new: true }, // { new: true } returns the updated document
		);

		if (!updatedAssistant) {
			return res.status(404).json({ message: "Assistant not found" });
		}

		// Log the updated assistant
		console.log("Updated assistant:", {
			id: updatedAssistant._id,
			basePrompt: updatedAssistant.basePrompt,
			prompts: updatedAssistant.prompts?.length || 0
		});

		// Send back the updated assistant
		res.status(200).json(updatedAssistant);
	} catch (error) {
		console.error("Error updating assistant:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
