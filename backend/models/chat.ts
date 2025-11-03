import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
	{
		question: { type: String, required: true },
		answer: { type: String, required: true },
	},
	{ timestamps: true },
);

const chatSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		user: { type: String, required: true },
		assistant: {
			type: Schema.Types.ObjectId,
			ref: "Assistant",
			required: true,
		},
		messages: [messageSchema],
		folderId: { type: String },
	},
	{ timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
