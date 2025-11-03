import mongoose from "mongoose";

const promptsSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  display: { type: String, required: true },
  prompt: { type: String, required: true },
});

const assistantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    jobTitle: { type: String, required: true },
    basePrompt: { type: String, required: true },
    user: { type: String, required: false },
    relatedAssistants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Assistant" },
    ], // Ensure this field is present
    prompts: [promptsSchema],
  },
  { timestamps: true }
);

const Assistant = mongoose.model("Assistant", assistantSchema);
export default Assistant;
