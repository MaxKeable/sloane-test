import { Schema, model } from "mongoose";

const moveClubRegistrationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      default: "Not provided",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    addedToCalendar: {
      type: Boolean,
      default: false,
    },
    invitedFriend: {
      type: Boolean,
      default: false,
    },
    friendName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model("MoveClubRegistration", moveClubRegistrationSchema);
