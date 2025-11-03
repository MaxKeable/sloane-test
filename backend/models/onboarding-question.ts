import mongoose, { InferSchemaType } from "mongoose";

const onboardingQuestionSchema = new mongoose.Schema({
  position: { type: Number, required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  videoThumbnailUrl: { type: String },
  description: { type: String },
  placeholderSentence: { type: String },
  serviceBusinessExample: { type: String },
  productBusinessExample: { type: String },
  deletedAt: { type: Date, required: false, default: null },
  __v: { type: Number, default: 0 },
  answers: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionAnswer" },
});

const OnboardingQuestion = mongoose.model(
  "OnboardingQuestion",
  onboardingQuestionSchema
);
export default OnboardingQuestion;

export type TOnboardingQuestion = InferSchemaType<
  typeof onboardingQuestionSchema
>;
