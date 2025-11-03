import express, { Request, Response } from "express";
import Assistant from "../../models/assistant";

const router = express.Router();

/**
 * @swagger
 * /api/admin/create-assistant:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new assistant
 *     description: Creates a new assistant with the provided name, image, description, job title, and base prompt.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the assistant.
 *                 example: Social Media Guru
 *               image:
 *                 type: string
 *                 description: URL to an image representing the assistant.
 *                 example: http://example.com/image.jpg
 *               description:
 *                 type: string
 *                 description: A brief description of the assistant and their expertise.
 *                 example: "I'm your go-to AI for all things social media marketing."
 *               jobTitle:
 *                 type: string
 *                 description: The job title or role of the assistant.
 *                 example: Social Media Marketer
 *               basePrompt:
 *                 type: string
 *                 description: The base prompt to initiate conversations with the assistant.
 *                 example: "Let's strategize your social media presence."
 *     responses:
 *       201:
 *         description: Successfully created a new assistant.
 *       400:
 *         description: Validation error - one or more required fields are missing.
 *       500:
 *         description: Server error
 */
router.post("/", async (req: Request, res: Response) => {
	const { name, image, description, jobTitle, basePrompt } = req.body;

	// Basic validation (you might want to use a library like joi for more comprehensive validation)
	if (!name || !image || !description || !jobTitle || !basePrompt) {
		return res
			.status(400)
			.json({ message: "Please provide all required fields" });
	}

	try {
		// Create a new assistant document
		const newAssistant = new Assistant({
			name,
			image,
			description,
			jobTitle,
			basePrompt,
		});

		// Save the assistant to the database
		const savedAssistant = await newAssistant.save();

		// Send back the created assistant
		res.status(201).json(savedAssistant);
	} catch (error) {
		console.error("Error creating new assistant:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
