import express, { Response } from "express";
import { z } from "zod";
import multer from "multer";
import type { Request } from "express";
import path from "path";
import fs from "fs";
import { validateRequestMiddleware } from "../../middleware/validate-request";
import { Video } from "../../models/video";
import { clerkClient } from "@clerk/express";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads/thumbnails");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
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

const createVideoSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
  thumbnailImage: z.any().optional(),
});

// Define the type for multer request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post(
  "/",
  upload.single("thumbnailImage"),
  validateRequestMiddleware(createVideoSchema),
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

      const { title, description, videoUrl } = req.body;
      console.log("Creating new video with data:", {
        title,
        description,
        videoUrl,
        thumbnailImage: req.file || {},
      });

      // Create video with or without thumbnail
      const videoData: any = {
        title,
        description,
        videoUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (req.file) {
        videoData.thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
      }

      const video = await Video.create(videoData);
      return res.status(201).json(video);
    } catch (error: any) {
      console.error("Error creating video:", error);
      // Clean up uploaded file if there was an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      if (error) {
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
