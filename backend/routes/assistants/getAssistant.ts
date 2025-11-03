import express, { Request, Response } from "express";
import Assistant from "../../models/assistant";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const assistant =
      await Assistant.findById(id).populate("relatedAssistants");
    console.log({ assistant: assistant?.relatedAssistants[0] });
    if (!assistant) {
      return res.status(404).json({ message: "Assistant not found" });
    }

    res.status(200).json(assistant);
  } catch (error) {
    console.error("Error fetching assistant:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
