import { Router } from "express";
import OnboardingQuestion from "../../models/onboarding-question";

const router = Router();

router.get("/", async (_, res) => {
  const questions = await OnboardingQuestion.find({ deletedAt: null }).sort({
    position: 1,
  });

  if (!questions) {
    return res.status(404).json({ message: "No questions found" });
  }

  res.json(questions);
});

export default router;
