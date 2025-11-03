import express from "express";
import { z } from "zod";
import { validateRequestMiddleware } from "../../middleware/validate-request";
import OnboardingQuestion from "../../models/onboarding-question";
import checkAdmin from "../../middleware/checkAdmin";

const router = express.Router();

const createQuestionSchema = z.object({
  position: z.number(),
  title: z.string(),
  videoUrl: z.string(),
  videoThumbnailUrl: z.string().optional(),
  description: z.string().optional(),
  placeholderSentence: z.string().optional(),
  serviceBusinessExample: z.string().optional(),
  productBusinessExample: z.string().optional(),
});

router.post(
  "/",
  checkAdmin,
  validateRequestMiddleware(createQuestionSchema),
  async (req, res) => {
    console.log('Creating new question with data:', req.body);

    const {
      position,
      title,
      videoUrl,
      videoThumbnailUrl,
      description,
      placeholderSentence,
      serviceBusinessExample,
      productBusinessExample
    } = req.body;

    const newQuestion = await OnboardingQuestion.create({
      videoUrl,
      videoThumbnailUrl,
      title,
      position,
      description,
      placeholderSentence,
      serviceBusinessExample,
      productBusinessExample
    });

    console.log('Question created:', newQuestion);
    return res.status(200).json(newQuestion);
  }
);

export default router;
