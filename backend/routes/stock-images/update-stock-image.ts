import { Router, Response } from "express";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { clerkClient } from "@clerk/express";
import multer from "multer";
import StockImages from "../../models/stockImages";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = Router();
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT_URL ?? "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put("/:key", upload.single("file"), async (req: any, res: Response) => {
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

    const { key } = req.params;

    if (!key) {
      return res
        .status(400)
        .json({ success: false, error: "File key is required" });
    }

    const tags = JSON.parse(req.body.tags);
    const title = req.body.title;
    const description = req.body.description;

    // Check if the file exists in S3
    const checkFileExistsCommand = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    try {
      await s3Client.send(checkFileExistsCommand);
    } catch (err) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    let fileUrl;
    let fileSize;

    if (req.file) {
      // Update the file in S3 if a new file is uploaded
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ContentDisposition: `attachment; filename="${key}"`,
      });

      await s3Client.send(command);

      fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
      fileSize = req.file.size;
    }

    // Update metadata in the database
    const updateData: any = {
      tags,
      title,
      description,
    };

    if (fileUrl) {
      updateData.imageUrl = fileUrl;
      updateData.imageSize = fileSize;
    }

    const updatedStockImage = await StockImages.findOneAndUpdate(
      { imageName: key },
      updateData,
      { new: true }
    );

    if (!updatedStockImage) {
      return res
        .status(404)
        .json({ success: false, error: "Image metadata not found" });
    }

    console.log(`✅ Successfully updated metadata: ${key}`);

    res.json({
      success: true,
      message: `Metadata updated successfully`,
      updatedStockImage,
    });
  } catch (error) {
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
      error: "Failed to update metadata",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

export default router;
