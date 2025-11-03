import express from "express";
import { Action } from "../../models/actions";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		console.log("Received save action request:", req.body); // Debug log

		const { 
			chatId, 
			messageId, 
			assistantId, 
			userId, 
			text, 
			title,
			description,
			dueDate,
			priority,
			status,
			tags,
			notes = [],
			colour,
			column 
		} = req.body;

		const action = new Action({
			chatId,
			messageId,
			assistantId,
			userId,
			text,
			title: title || text, // Use text as title if no title provided
			description,
			dueDate,
			priority,
			status: status || 'Not Started',
			tags: tags || [],
			notes: notes.map((note: string) => ({
				text: note,
				timestamp: new Date(),
				checked: false,
				id: uuidv4(),
			})),
			colour: colour || '',
			column: column || 'idea'
		});

		console.log("Attempting to save action:", action); // Debug log

		await action.save();
		res.status(201).json(action);
	} catch (error) {
		console.error("Error in saveAction:", error);
		res.status(500).json({ error: "Failed to save action" });
	}
});

export default router;
