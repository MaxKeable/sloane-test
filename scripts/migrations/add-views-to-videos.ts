const mongoose = require("mongoose");
const { Video } = require("../../api/models/video");

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test");
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