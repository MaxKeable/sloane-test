import { Router, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { clerkClient } from "@clerk/express";
import StockImages from "../../models/stockImages";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = Router();

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req: any, res: Response) => {
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

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const tags = JSON.parse(req.body.tags);
    const title = req.body.title;
    const description = req.body.description;
    const fileSize = req.file.size;

    const fileExtension = req.file.originalname.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    const fileUrl = `${R2_PUBLIC_URL}/${uniqueFileName}`;

    // Store metadata in the database
    const stockImagesData = await StockImages.create({
      tags,
      title,
      description,
      imageName: uniqueFileName,
      imageUrl: fileUrl,
      imageSize: fileSize,
    });

    res.json({
      success: true,
      stockImagesData,
    });
  } catch (error: any) {
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }
      if (error.message === "Unauthorized") {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }
    }

    res.status(500).json({
      success: false,
      error: error?.message,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

export default router;
