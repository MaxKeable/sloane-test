import express from "express";
import OnboardingQuestion from "../../models/onboarding-question";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const question = await OnboardingQuestion.findById(req.params.id);
  console.log('Retrieved question:', question);
  return res.status(200).json(question);
});

export default router;
