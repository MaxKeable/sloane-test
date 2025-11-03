import express from "express";
import { Action } from "../../models/actions";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.put("/:actionId/:noteId", async (req, res) => {
	try {
		const { actionId, noteId } = req.params;
		const userId = getUserIdFromBearer(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		// First find the action and note
		const action = await Action.findOne({ _id: actionId, userId });
		if (!action) {
			return res.status(404).json({ error: "Action not found" });
		}

		// Find the note and toggle its checked status
		const note = action.notes.find((note) => note.id === noteId);
		if (!note) {
			return res.status(404).json({ error: "Note not found" });
		}

		// Update the note's checked status
		const updatedAction = await Action.findOneAndUpdate(
			{ _id: actionId, userId, "notes.id": noteId },
			{ $set: { "notes.$.checked": !note.checked } },
			{ new: true },
		);

		res.json(updatedAction);
	} catch (error) {
		console.error("Error toggling note:", error);
		res.status(500).json({ error: "Failed to toggle note" });
	}
});

export default router;
