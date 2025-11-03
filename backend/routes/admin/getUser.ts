import express, { Request, Response } from "express";
import User from "../../models/user";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    !id ? res.status(400).json({ message: "User ID is required" }) : null;
    const user = await User.findOne({ clerkUserId: id });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log({ user });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
