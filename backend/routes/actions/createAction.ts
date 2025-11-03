import express from "express";
import { Action } from "../../models/actions";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    console.log("Received request body:", req.body);

    const {
      text,
      title,
      description,
      dueDate,
      priority,
      status,
      tags,
      column,
      userId,
      notes = [],
      colour,
    } = req.body;

    console.log("Parsed fields:", {
      hasText: !!text,
      hasTitle: !!title,
      hasDescription: !!description,
      hasDueDate: !!dueDate,
      hasPriority: !!priority,
      hasStatus: !!status,
      hasTags: Array.isArray(tags),
      hasColumn: !!column,
      hasUserId: !!userId,
      hasNotes: Array.isArray(notes),
      hasColour: !!colour,
    });

    console.log("Creating new action with data:", {
      text,
      title,
      description,
      dueDate,
      priority,
      status,
      tags,
      column,
      userId,
      notes,
      colour,
    });

    const newAction = new Action({
      text,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      status,
      tags,
      column,
      userId,
      colour,
      notes: notes.map((noteText: string) => ({
        text: noteText,
        timestamp: new Date(),
        checked: false,
        id: uuidv4(),
      })),
    });

    const savedAction = await newAction.save();
    console.log("Action saved successfully:", savedAction);

    if (!savedAction) {
      console.error("Failed to create action - no saved document returned");
      return res.status(400).json({ error: "Failed to create action" });
    }

    res.status(201).json(savedAction);
  } catch (error: any) {
    console.error("Error creating action:", error);
    if (error.name === "ValidationError") {
      console.error("Validation Error Details:", error.errors);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
