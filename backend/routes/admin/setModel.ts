import express, { Request, Response } from "express";
import Config from "../../models/config"; // Adjust the path according to your project structure

const router = express.Router();

// PUT route to update the aiService or create a new config if it doesn't exist
router.put("/", async (req: Request, res: Response) => {
  const { aiService } = req.body;

  // Ensure aiService is provided
  if (!aiService) {
    return res.status(400).json({ message: "aiService is required" });
  }

  try {
    // Validate that aiService is one of the allowed options
    const allowedServices = ["gemini", "openAi", "deepseek", "anthropic"]; // Add more options as needed

    if (!allowedServices.includes(aiService)) {
      return res.status(400).json({ message: "Invalid aiService value" });
    }

    let config = await Config.findOne(); // Assuming there's only one config document

    if (!config) {
      // If no config exists, create a new one
      config = new Config({ aiService });
      await config.save();
      return res.status(201).json({
        message: "Config created successfully",
        aiService: config.aiService,
      });
    }

    // Update the existing aiService value
    config.aiService = aiService;
    await config.save();

    return res.status(200).json({
      message: "AI service updated successfully",
      aiService: config.aiService,
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
});

export default router;
