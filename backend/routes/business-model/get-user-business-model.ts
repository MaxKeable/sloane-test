import express from "express";
import { getMe } from "../../utils/getMe";
import OnboardingQuestion from "../../models/onboarding-question";
import QuestionAnswer from "../../models/question-answer";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = await getMe(req);

    // Get all onboarding questions
    const questions = await OnboardingQuestion.find({ deletedAt: null })
      .sort({ position: 1 })
      .lean();

    // Get all answers for this user
    const userAnswers = await QuestionAnswer.find({ user: user?._id }).lean();

    // Create a map of question ID to answer for quick lookup
    const answerMap = userAnswers.reduce((map: any, answer) => {
      map[answer.question.toString()] = answer;
      return map;
    }, {});

    // Combine questions with their answers
    const businessModel = questions.map((question) => {
      const questionId = question._id.toString();
      const userAnswer = answerMap[questionId];

      return {
        question: {
          _id: question._id,
          position: question.position,
          title: question.title,
          videoUrl: question.videoUrl,
          videoThumbnailUrl: question.videoThumbnailUrl,
          description: question.description,
          placeholderSentence: question.placeholderSentence,
          serviceBusinessExample: question.serviceBusinessExample,
          productBusinessExample: question.productBusinessExample,
        },
        answer: userAnswer
          ? {
              _id: userAnswer._id,
              answer: userAnswer.answer,
            }
          : null,
      };
    });

    res.json({
      success: true,
      businessModel,
    });
  } catch (error: any) {
    console.error("Error fetching business model:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch business model",
      error: error.message,
    });
  }
});

export default router;
