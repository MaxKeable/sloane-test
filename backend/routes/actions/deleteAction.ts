import express from "express";
import { Action } from "../../models/actions";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.delete("/:actionId", async (req, res) => {
	try {
		const { actionId } = req.params;
		const userId = getUserIdFromBearer(req);

		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const deletedAction = await Action.findOneAndDelete({
			_id: actionId,
			userId,
		});
		if (!deletedAction) {
			return res.status(404).json({ error: "Action not found" });
		}

		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete action" });
	}
});

export default router;
