import mongoose, { Schema } from "mongoose";

const folderSchema = new mongoose.Schema({
	chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
	assistant: {
		type: Schema.Types.ObjectId,
		ref: "Assistant",
		required: true,
	},
	title: { type: String, required: true },
	user: { type: String, required: true },
});

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
