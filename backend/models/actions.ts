import mongoose, { Schema, Document } from "mongoose";

interface INote {
	text: string;
	timestamp: Date;
	checked: boolean;
	id: string;
}

const NoteSchema = new Schema({
	text: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
	checked: { type: Boolean, default: false },
	id: { type: String, required: true },
});

export interface IAction extends Document {
	chatId: string;
	messageId: string;
	assistantId: string;
	userId: string;
	text: string;
	title: string;
	description: string;
	dueDate: Date;
	priority: string;
	status: string;
	tags: string[];
	column: string;
	colour: string;
	notes: INote[];
	createdAt: Date;
	updatedAt: Date;
}

const ActionSchema = new Schema({
	chatId: {
		type: String,
		required: false,
		index: true,
	},
	messageId: {
		type: String,
		required: false,
		index: true,
	},
	assistantId: {
		type: String,
		required: false,
	},
	userId: {
		type: String,
		required: true,
		index: true,
	},
	text: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	dueDate: {
		type: Date,
		required: false,
	},
	priority: {
		type: String,
		enum: ['None', 'Low', 'Medium', 'High'],
		required: false,
	},
	status: {
		type: String,
		enum: ['Not Started', 'In Progress', 'Completed'],
		required: false,
		default: 'Not Started'
	},
	tags: {
		type: [String],
		required: false,
		default: [],
	},
	column: {
		type: String,
		required: true,
	},
	colour: {
		type: String,
		required: false,
	},
	notes: {
		type: [NoteSchema],
		required: false,
		default: [],
	},
}, { timestamps: true });

export const Action = mongoose.model<IAction>("Action", ActionSchema);
