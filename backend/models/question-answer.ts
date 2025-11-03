import mongoose, { InferSchemaType, Document } from "mongoose";

export interface IQuestionAnswer extends Document {
  answer: string;
  user: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionAnswerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnboardingQuestion",
    required: true,
  },
}, { timestamps: true });

questionAnswerSchema.index({ user: 1, question: 1 }, { unique: true });

const QuestionAnswer = mongoose.model<IQuestionAnswer>("QuestionAnswer", questionAnswerSchema);
export default QuestionAnswer;

export type TQuestionAnswer = InferSchemaType<typeof questionAnswerSchema>;
