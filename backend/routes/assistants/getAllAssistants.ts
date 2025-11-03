import express, { Request, Response } from "express";
import { getAllAssistants } from "../../utils/getAllAssistants";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromBearer(req);
		const assistants = await getAllAssistants(userId);
		res.status(200).json(assistants);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
