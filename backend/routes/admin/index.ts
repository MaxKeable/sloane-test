import express from "express";
import createAssistant from "./createAssistant";
import updateAssistant from "./updateAssistant";
import createNewUser from "../createNewUser";
import updateUser from "./updateUser";
import getAllUsers from "./getAllUsers";
import getUser from "./getUser";
import addPrompt from "./addPrompt";
import prompts from "./prompts";
import setModel from "./setModel";
import getConfig from "./getConfig";
import getUsersBusinessPlan from "./get-users-business-plan";
import getUserStatistics from "./getUserStatistics";
import softDeleteUser from "./softDeleteUser";

const router = express.Router();

router.use("/create-assistant", createAssistant);
router.use("/update-assistant", updateAssistant);
router.use("/create-user", createNewUser);
router.use("/update-user", updateUser);
router.use("/get-users", getAllUsers);
router.use("/get-user", getUser);
router.use("/add-prompt", addPrompt);
router.use("/prompts", prompts);
router.use("/update-ai-service", setModel);
router.use("/get-config", getConfig);
router.use("/get-users-business-plan", getUsersBusinessPlan);
router.use("/user-statistics", getUserStatistics);
router.use("/soft-delete-user", softDeleteUser);

export default router;
