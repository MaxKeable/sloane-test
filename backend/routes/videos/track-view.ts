import express from "express";
import { Video } from "../../models/video";

const router = express.Router();

router.post("/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    return res.status(200).json({ views: video.views });
  } catch (error) {
    console.error("Error tracking video view:", error);
    return res.status(500).json({ error: "Failed to track video view" });
  }
});

export default router; 