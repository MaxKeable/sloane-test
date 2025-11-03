import express from "express";
import { Action } from "../../models/actions";

const router = express.Router();

router.put("/:actionId", async (req, res) => {
	try {
		const { actionId } = req.params;
		const { colour } = req.body;

		const updatedAction = await Action.findByIdAndUpdate(
			actionId,
			{ colour },
			{ new: true },
		);

		if (!updatedAction) {
			return res.status(404).json({ error: "Action not found" });
		}

		res.json(updatedAction);
	} catch (error) {
		console.error("Error updating action colour:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
