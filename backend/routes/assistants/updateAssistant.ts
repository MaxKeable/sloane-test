import express, { Request, Response } from "express";
import Assistant from "../../models/assistant";
import generateAssistantPrompt from "../../utils/generateAssistantPrompt";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    image,
    description,
    jobTitle,
    basePrompt,
    relatedAssistants,
    prompts,
    user,
  } = req.body;

  console.log("Received update request in assistants route:", {
    id,
    basePrompt,
    prompts: prompts?.length || 0,
    user,
  });

  // Basic validation
  if (!name || !image || !description || !jobTitle || !basePrompt) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // Get the user ID from the token
    const userId = await getUserIdFromBearer(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the assistant first to check ownership
    const existingAssistant = await Assistant.findById(id);

    if (!existingAssistant) {
      return res.status(404).json({ message: "Assistant not found" });
    }

    // Check if the user is the owner of this assistant
    if (existingAssistant.user && existingAssistant.user !== userId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own custom assistants" });
    }

    // Generate AI-enhanced prompt from user's input
    const enhancedPrompt = await generateAssistantPrompt(basePrompt);
    console.log("Generated enhanced prompt:", enhancedPrompt);

    // Update the assistant document
    const updatedAssistant = await Assistant.findByIdAndUpdate(
      id,
      {
        name,
        image,
        description,
        jobTitle,
        basePrompt: enhancedPrompt, // Use the enhanced prompt
        relatedAssistants,
        prompts,
        user: user || userId, // Ensure user field is preserved
      },
      { new: true, runValidators: true }
    );

    console.log("Updated assistant:", {
      id: updatedAssistant?._id,
      basePrompt: updatedAssistant?.basePrompt,
      prompts: updatedAssistant?.prompts?.length || 0,
    });

    res.status(200).json(updatedAssistant);
  } catch (error) {
    console.error("Error updating assistant:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
