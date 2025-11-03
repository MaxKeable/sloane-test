import express from "express";
import QuestionAnswer from "../../models/question-answer";
import { z } from "zod";
import { validateRequestMiddleware } from "../../middleware/validate-request";
import { getMe } from "../../utils/getMe";
import User from "../../models/user";

const router = express.Router();

const createQuestionAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
});

router.post(
  "/",
  validateRequestMiddleware(createQuestionAnswerSchema),
  async (req, res) => {
    const { questionId, answer, userId = null } = req.body;
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await getMe(req);
    }

    const questionAnswer = await QuestionAnswer.create({
      question: questionId,
      answer,
      user,
    });

    if (questionAnswer) {
      await User.findByIdAndUpdate(user?._id, {
        onboardingProgress: (user?.onboardingProgress ?? 0) + 1,
      });
    }

    res.status(201).json(questionAnswer);
  }
);

export default router;
