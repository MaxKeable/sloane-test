import { Router } from "express";
import OnboardingQuestion, {
  TOnboardingQuestion,
} from "../../models/onboarding-question";

const router = Router();

const questions: TOnboardingQuestion[] = [
  {
    position: 1,
    title: "What this question is about",
    videoUrl: "https://vimeo.com/123456",
    videoThumbnailUrl: "thumbnail-url",
    description: "What this question is really setting out to do is.....",
    deletedAt: null,
    __v: 0,
    placeholderSentence: "",
    serviceBusinessExample: "",
    productBusinessExample: "",
  },
  {
    position: 2,
    title: "question 2",
    videoUrl: "https://vimeo.com/135850173",
    videoThumbnailUrl: "https://i.vimeocdn.com/video/1045908090-1045908090",
    description: "This is a description",
    deletedAt: null,
    __v: 0,
    placeholderSentence: "",
    serviceBusinessExample: "",
    productBusinessExample: "",
  },
  {
    position: 3,
    title: "question 3",
    videoUrl: "https://vimeo.com/167254041",
    videoThumbnailUrl: "https://i.vimeocdn.com/video/1045908090-1045908090",
    description: "This is a description",
    deletedAt: null,
    __v: 0,
    placeholderSentence: "",
    serviceBusinessExample: "",
    productBusinessExample: "",
  },
  {
    position: 4,
    title: "question 4",
    videoUrl: "https://vimeo.com/1045908090",
    videoThumbnailUrl: "https://i.vimeocdn.com/video/1045908090-1045908090",
    description: "This is a description",
    deletedAt: null,
    __v: 0,
    placeholderSentence: "",
    serviceBusinessExample: "",
    productBusinessExample: "",
  },
];

router.post("/", async (req, res) => {
  await OnboardingQuestion.deleteMany({});

  for (const question of questions) {
    await OnboardingQuestion.create(question);
  }

  res.json({ message: "Questions seeded" });
});

export default router;
