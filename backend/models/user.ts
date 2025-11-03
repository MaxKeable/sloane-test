import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, required: false },
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: false },
    stripeCustomerId: { type: String, required: false, unique: true },
    goalTracking: {
      isEnabled: { type: Boolean, default: true },
      weeklyGoals: [
        {
          title: { type: String, required: true },
          isCompleted: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
          completedAt: { type: Date },
        },
      ],
      monthlyGoals: [
        {
          title: { type: String, required: true },
          isCompleted: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
          completedAt: { type: Date },
        },
      ],
    },
    businessProfile: {
      businessName: { type: String, required: false },
      businessType: { type: String, required: false },
      businessTypes: [{ type: String }],
      businessSize: { type: Number, required: false },
      businessDescription: { type: String, required: false },
      businessUrl: { type: String, required: false },
      instagramUrl: { type: String, required: false },
      referralSource: { type: String, required: false },
      friendName: { type: String, required: false },
      motivation: { type: String, required: false },
    },
    questionAnswers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "QuestionAnswer" },
    ],
    onboardingCompleted: { type: Boolean, default: false },
    onboardingProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export type TUser = mongoose.InferSchemaType<typeof userSchema>;

export default User;
