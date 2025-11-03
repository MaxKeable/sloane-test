import express from "express";
import { Action } from "../../models/actions";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.delete("/:actionId/:noteId", async (req, res) => {
	try {
		const { actionId, noteId } = req.params;
		const userId = getUserIdFromBearer(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const updatedAction = await Action.findOneAndUpdate(
			{ _id: actionId, userId },
			{ $pull: { notes: { id: noteId } } },
			{ new: true },
		);

		if (!updatedAction) {
			return res.status(404).json({ error: "Action not found" });
		}

		res.json(updatedAction);
	} catch (error) {
		res.status(500).json({ error: "Failed to delete note" });
	}
});

export default router;
