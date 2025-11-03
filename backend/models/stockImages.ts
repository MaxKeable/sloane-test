import mongoose from "mongoose";

const stockImageSchema = new mongoose.Schema({
  tags: { type: [String], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageName: { type: String, required: true },
  imageSize: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const StockImages = mongoose.model("Stockimage", stockImageSchema);

export default StockImages; 