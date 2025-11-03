// ***************************************************************
//                 IMPORTS
// ***************************************************************
import express, { Request, Response } from "express";
import Assistant from "../../models/assistant";
import mongoose from "mongoose";

// ***************************************************************
//                 ROUTER
// ***************************************************************
const router = express.Router();

// ***************************************************************
//                 GET: List all prompts with assistant info
// ***************************************************************
router.get("/", async (req: Request, res: Response) => {
  try {
    const assistants = await Assistant.find({}, "name prompts");
    // Flatten prompts with assistant info
    const allPrompts = assistants.flatMap((assistant) =>
      (assistant.prompts || []).map((prompt: any) => ({
        assistantId: assistant._id,
        assistantName: assistant.name,
        ...(prompt.toObject?.() || prompt),
      }))
    );
    res.status(200).json({ prompts: allPrompts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ***************************************************************
//                 POST: Add a prompt to an assistant
// ***************************************************************
router.post("/", async (req: Request, res: Response) => {
  const { assistantId, display, prompt } = req.body;
  if (!assistantId || !display || !prompt) {
    return res
      .status(400)
      .json({ message: "assistantId, display, and prompt are required" });
  }
  try {
    // Add a unique _id to the prompt for future updates/deletes
    const promptObj = { _id: new mongoose.Types.ObjectId(), display, prompt };
    const updated = await Assistant.findByIdAndUpdate(
      assistantId,
      { $push: { prompts: promptObj } },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Assistant not found" });
    res.status(201).json({ prompts: updated.prompts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ***************************************************************
//                 PUT: Update a specific prompt for an assistant
// ***************************************************************
router.put("/:assistantId/:promptId", async (req: Request, res: Response) => {
  const { assistantId, promptId } = req.params;
  const { display, prompt } = req.body;
  if (!display || !prompt) {
    return res.status(400).json({ message: "display and prompt are required" });
  }
  try {
    const assistant = await Assistant.findById(assistantId);
    if (!assistant)
      return res.status(404).json({ message: "Assistant not found" });
    const promptObj = assistant.prompts.id(promptId);
    if (!promptObj)
      return res.status(404).json({ message: "Prompt not found" });
    promptObj.display = display;
    promptObj.prompt = prompt;
    await assistant.save();
    res.status(200).json({ prompts: assistant.prompts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ***************************************************************
//                 DELETE: Remove a prompt from an assistant
// ***************************************************************
router.delete(
  "/:assistantId/:promptId",
  async (req: Request, res: Response) => {
    const { assistantId, promptId } = req.params;
    try {
      const assistant = await Assistant.findById(assistantId);
      if (!assistant)
        return res.status(404).json({ message: "Assistant not found" });
      const promptObj = assistant.prompts.id(promptId);
      if (!promptObj)
        return res.status(404).json({ message: "Prompt not found" });
      assistant.prompts.pull(promptId);
      await assistant.save();
      res.status(200).json({ prompts: assistant.prompts });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// ***************************************************************
//                 EXPORTS
// ***************************************************************
export default router;
// ***************************************************************
//                 NOTES
// ***************************************************************
// - All endpoints are admin-protected (add middleware as needed)
// - Prompts are stored as subdocuments in Assistant
// - Each prompt now has a unique _id for update/delete
// - Returns updated prompts array after each operation
