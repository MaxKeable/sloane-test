import express, { Request, Response } from "express";
import Assistant from "../../models/assistant";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log("Received delete request for assistant:", id);

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
      return res.status(403).json({ message: "You can only delete your own custom assistants" });
    }

    // Delete the assistant
    await Assistant.findByIdAndDelete(id);

    console.log("Successfully deleted assistant:", id);

    res.status(200).json({ message: "Assistant successfully deleted", id });
  } catch (error) {
    console.error("Error deleting assistant:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 