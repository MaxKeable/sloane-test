import express from "express";
import { Video } from "../../models/video";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log('Fetching all videos');
    const videos = await Video.find().sort({ createdAt: -1 });
    console.log(`Found ${videos.length} videos`);
    return res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log('Fetching video with id:', req.params.id);
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      console.log('Video not found');
      return res.status(404).json({ error: 'Video not found' });
    }

    console.log('Video found:', video);
    return res.status(200).json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return res.status(500).json({ error: 'Failed to fetch video' });
  }
});

export default router; 