import { Router, Request, Response } from "express";
import StockImages from "../../models/stockImages";
import getUserIdFromBearer from "../../utils/getUserIdFromBearer";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    // Verify authentication
    const userId = getUserIdFromBearer(req);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Fetch stock images from MongoDB
    const stockImages = await StockImages.find({});

    if (!stockImages.length) {
      console.log("No images found in database");
      return res.json({ success: true, images: [] });
    }

    console.log(
      `✅ Successfully fetched ${stockImages.length} images from database`
    );
    res.json({ success: true, images: stockImages });
  } catch (error) {
    console.error("❌ Error fetching stock images:", error);

    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch stock images",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

export default router;
