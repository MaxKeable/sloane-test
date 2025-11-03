import express from "express";
import QuestionAnswer from "../../models/question-answer";
import { getMe } from "../../utils/getMe";

const router = express.Router();
router.get("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const user = await getMe(req);

  const questionAnswer = await QuestionAnswer.findOne({
    question: questionId,
    user: user.id,
  });
  res.json(questionAnswer);
});

export default router;
