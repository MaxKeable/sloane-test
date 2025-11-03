import express, { Request, Response } from "express";
import User from "../../models/user";

const router = express.Router();

router.put("/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		// Update the assistant document
		const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Send back the updated assistant
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
