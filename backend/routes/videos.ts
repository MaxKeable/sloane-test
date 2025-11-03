import express from "express";
import checkAdmin from "../middleware/checkAdmin";
import { Video } from "../models/video";

const router = express.Router();

// Get all videos
router.get("/", async (req, res) => {
    try {
        const videos = await Video.find({});
        res.status(200).json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ message: "Error fetching videos" });
    }
});

// Get a single video by ID
router.get("/:id", async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(video);
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ message: "Error fetching video" });
    }
});

// Create a new video (admin only)
router.post("/", checkAdmin, async (req, res) => {
    try {
        const video = new Video(req.body);
        await video.save();
        res.status(201).json(video);
    } catch (error) {
        console.error("Error creating video:", error);
        res.status(500).json({ message: "Error creating video" });
    }
});

// Update a video (admin only)
router.put("/:id", checkAdmin, async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(video);
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ message: "Error updating video" });
    }
});

// Delete a video (admin only)
router.delete("/:id", checkAdmin, async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({ message: "Error deleting video" });
    }
});

export default router; 