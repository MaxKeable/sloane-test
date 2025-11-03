import express, { Request, Response } from "express";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validateRequestMiddleware } from "../../middleware/validate-request";
import { Video } from "../../models/video";
import { clerkClient } from "@clerk/express";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

// Define the type for multer request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, "../../uploads/thumbnails");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
        )
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const updateVideoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
});

router.put(
  "/:id",
  upload.single("thumbnailImage"),
  validateRequestMiddleware(updateVideoSchema),
  async (req: MulterRequest, res: Response) => {
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
      console.log("Updating video with id:", id);
      console.log("Update data:", req.body);

      const video = await Video.findById(id);
      if (!video) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: "Video not found" });
      }

      const updateData = { ...req.body };

      // If a new thumbnail was uploaded
      if (req.file) {
        // Delete old thumbnail if it exists
        if (video.thumbnailUrl) {
          const oldPath = path.join(__dirname, "../..", video.thumbnailUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updateData.thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
      }

      const updatedVideo = await Video.findByIdAndUpdate(
        id,
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true }
      );

      console.log("Video updated:", updatedVideo);
      return res.status(200).json(updatedVideo);
    } catch (error: any) {
      console.error("Error updating video:", error);
      // Clean up uploaded file if there was an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

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

      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
