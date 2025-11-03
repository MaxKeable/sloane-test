import express from "express";
import OnboardingQuestion from "../../models/onboarding-question";
import checkAdmin from "../../middleware/checkAdmin";

const router = express.Router();

router.delete("/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const question = await OnboardingQuestion.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
    res.status(200).json(question);
  } catch (error) {
    console.error("Error removing question", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
