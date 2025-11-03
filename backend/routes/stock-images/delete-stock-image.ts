import { Router, Request, Response } from "express";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { clerkClient } from "@clerk/express";
import StockImages from "../../models/stockImages";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = Router();

// Initialize the R2 client
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT_URL ?? "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

router.delete("/", async (req: Request, res: Response) => {
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

    // Get the file keys from the request body
    const { keys } = req.body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "File keys are required" });
    }

    // Delete each file from R2 (S3-compatible storage)
    const deletePromises = keys.map(async (key: string) => {
      await StockImages.deleteOne({ imageName: key });
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      await s3Client.send(command);
      console.log(`✅ Successfully deleted file: ${key}`);
    });

    await Promise.all(deletePromises);

    res.json({
      success: true,
      message: `Files deleted successfully`,
    });
  } catch (error: any) {
    console.error("❌ Error deleting files:", error);

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
      error: "Failed to delete files",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

export default router;
