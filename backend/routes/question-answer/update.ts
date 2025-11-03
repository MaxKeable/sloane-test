import express from "express";
import QuestionAnswer from "../../models/question-answer";
import { z } from "zod";
import { validateRequestMiddleware } from "../../middleware/validate-request";

const router = express.Router();

const updateQuestionAnswerSchema = z.object({
  answer: z.string(),
});

router.patch(
  "/:id",
  validateRequestMiddleware(updateQuestionAnswerSchema),
  async (req, res) => {
    const { id } = req.params;
    const { answer } = req.body;
    const questionAnswer = await QuestionAnswer.findByIdAndUpdate(id, {
      answer,
    });

    if (!questionAnswer) {
      return res.status(404).json({ message: "Question answer not found" });
    }

    res.json(questionAnswer);
  }
);

export default router;
