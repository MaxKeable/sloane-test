import express from "express";
import adminRoutes from "./admin";
import assistantRoutes from "./assistants";
import stripe from "./stripe";
import userRoutes from "./user";
import actions from "./actions";
import questionRoutes from "./question";
import questionAnswerRoutes from "./question-answer";
import businessPrompts from "./business-prompts";
import businessModel from "./business-model";
import stockImages from "./stock-images";
import videoRoutes from "./videos";
import userStatistics from "./user-statistics";
import weatherRoutes from "./weather";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/assistants", assistantRoutes);
router.use("/stripe", stripe);
router.use("/actions", actions);
router.use("/question", questionRoutes);
router.use("/question-answers", questionAnswerRoutes);
router.use("/business-prompts", businessPrompts);
router.use("/business-model", businessModel);
router.use("/stock-images", stockImages);
router.use("/videos", videoRoutes);
router.use("/user-statistics", userStatistics);
router.use("/weather", weatherRoutes);

export default router;
