import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Video } from "../../models/video";
import { clerkClient } from "@clerk/express";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    // Verify authentication
    const userId = getUserIdFromBearer(req);
    const user = await clerkClient.users.getUser(userId ?? "");
    if (!userId) {
      throw new Error("Authentication required");
    }
    if (user.publicMetadata.account !== "admin") {
      throw new Error("Unauthorized");
    }

    const { id } = req.params;
    console.log("Deleting video with id:", id);

    const video = await Video.findById(id);
    if (!video) {
      console.log("Video not found");
      return res.status(404).json({ error: "Video not found" });
    }

    // Delete thumbnail file if it exists
    if (video.thumbnailUrl) {
      const thumbnailPath = path.join(__dirname, "../..", video.thumbnailUrl);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
        console.log("Thumbnail file deleted:", thumbnailPath);
      }
    }

    await Video.findByIdAndDelete(id);
    console.log("Video deleted successfully");
    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);

    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }
      if (error.message === "Unauthorized") {
        return res.status(403).json({
          success: false,
          error: "Unauthorized",
        });
      }
    }

    return res.status(500).json({ error: "Failed to delete video" });
  }
});

export default router;
