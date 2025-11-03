import express from "express";
import { Action } from "../../models/actions";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.get("/:column", async (req, res) => {
	try {
		const { column } = req.params;
		const userId = getUserIdFromBearer(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const actions = await Action.find({
			userId,
			column,
		});

		res.json(actions);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch actions" });
	}
});

export default router;
