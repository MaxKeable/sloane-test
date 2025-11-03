import express from "express";
import saveAction from "./saveAction";
import getActionsByColumn from "./getActionsByColumn";
import updateColumn from "./updateColumn";
import addNote from "./addNote";
import toggleNote from "./toggleNote";
import deleteAction from "./deleteAction";
import deleteNote from "./deleteNote";
import updateColour from "./updateColour";
import createAction from "./createAction";
import getUserFilters from "./getUserFilters";
import updateAction from "./updateAction";
const router = express.Router();

console.log("Registering actions routes...");

router.use("/save-action", saveAction);
router.use("/by-column", getActionsByColumn);
router.use("/update-column", updateColumn);
router.use("/add-note", addNote);
router.use("/toggle-note", toggleNote);
router.use("/delete", deleteAction);
router.use("/delete-note", deleteNote);
router.use("/update-color", updateColour);
router.use("/create", createAction);
router.use("/user-filters", getUserFilters);
router.use("/update", updateAction);

export default router;
