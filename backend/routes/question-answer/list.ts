import express from "express";
import QuestionAnswer from "../../models/question-answer";

const router = express.Router();

router.get("/", async (_req, res) => {
  const questionAnswers = await QuestionAnswer.find();
  res.json(questionAnswers);
});

export default router;
