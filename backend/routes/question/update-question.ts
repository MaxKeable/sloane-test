import express from "express";
import { z } from "zod";
import { validateRequestMiddleware } from "../../middleware/validate-request";
import OnboardingQuestion from "../../models/onboarding-question";
import checkAdmin from "../../middleware/checkAdmin";

const router = express.Router();

const updateQuestionSchema = z.object({
  title: z.string().optional(),
  videoUrl: z.string().optional(),
  videoThumbnailUrl: z.string().optional(),
  description: z.string().optional(),
  placeholderSentence: z.string().optional(),
  serviceBusinessExample: z.string().optional(),
  productBusinessExample: z.string().optional(),
});

router.put(
  "/:id",
  checkAdmin,
  validateRequestMiddleware(updateQuestionSchema),
  async (req, res) => {
    console.log('Updating question with ID:', req.params.id);
    console.log('Update data:', req.body);

    const { id } = req.params;
    const {
      title,
      videoUrl,
      videoThumbnailUrl,
      description,
      placeholderSentence,
      serviceBusinessExample,
      productBusinessExample,
    } = req.body;

    const updatedQuestion = await OnboardingQuestion.findByIdAndUpdate(
      id,
      {
        title,
        videoUrl,
        videoThumbnailUrl,
        description,
        placeholderSentence,
        serviceBusinessExample,
        productBusinessExample,
      },
      { new: true }
    );

    console.log('Question updated:', updatedQuestion);
    return res.status(200).json(updatedQuestion);
  }
);

export default router;
