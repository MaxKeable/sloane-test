import express from "express";
import { Action } from "../../models/actions";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/:actionId", async (req, res) => {
	try {
		const { actionId } = req.params;
		const { note } = req.body;
		const userId = getUserIdFromBearer(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const noteObject = {
			text: note,
			timestamp: new Date(),
			checked: false,
			id: uuidv4(),
		};

		const updatedAction = await Action.findOneAndUpdate(
			{ _id: actionId, userId },
			{ $push: { notes: noteObject } },
			{ new: true },
		);

		if (!updatedAction) {
			return res.status(404).json({ error: "Action not found" });
		}

		res.json(updatedAction);
	} catch (error) {
		res.status(500).json({ error: "Failed to add note" });
	}
});

export default router;
