import express, { Request, Response } from "express";
import Config from "../../models/config";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		// Update the assistant document
		const config = await Config.find({});

		if (!config) {
			return res.status(404).json({ message: "Config not found" });
		}

		// Send back the updated assistant
		res.status(200).json(config);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
