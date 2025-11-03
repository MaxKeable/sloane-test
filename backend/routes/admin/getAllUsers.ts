import express, { Request, Response } from "express";
import User from "../../models/user";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		// Update the assistant document
		const user = await User.find({});
		
		 //! I'm sorry max - I wanted to be quick and dirty. Please forgive me for this bad bad naughty girl slut of code.
		const users = user.filter((user) => !user.isDeleted);

		if (!users) {
			return res.status(404).json({ message: "Users not found" });
		}

		// Send back the updated assistant
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
