const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../api/.env") });

const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.DEV_MONGO_URI;

console.log("Using connection string:", connectionString);

// Define the video schema since we can't import the TypeScript file directly
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

async function migrate() {
  try {
    // Connect to MongoDB using the correct connection string
    if (!connectionString) {
      throw new Error(
        "MongoDB connection string is undefined. Make sure DEV_MONGO_URI or MONGO_URI is set in api/.env"
      );
    }

    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB");

    // Update all videos to add views field if it doesn't exist
    const result = await Video.updateMany(
      { views: { $exists: false } },
      { $set: { views: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} videos to add views field`);

    await mongoose.disconnect();
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
