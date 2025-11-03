import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  aiService: {
    type: String,
    required: true,
    enum: ["gemini", "openAi", "deepseek", "anthropic"],
  },
});

const Config = mongoose.model("Config", configSchema);
export default Config;
