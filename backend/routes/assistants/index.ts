import express from "express";
import getAllAssistants from "./getAllAssistants";
import getAssistant from "./getAssistant";
import updateAssistant from "./updateAssistant";
import { createAssistant } from "./createAssistant";
import { generatePrompt } from "./generatePrompt";
import deleteAssistant from "./deleteAssistant";

const router = express.Router();

router.use("/get-all-assistants", getAllAssistants);
router.use("/get-assistant", getAssistant);
router.use("/update-assistant", updateAssistant);
router.post("/create-assistant", createAssistant);
router.post("/generate-prompt", generatePrompt);
router.use("/delete-assistant", deleteAssistant);

export default router;
