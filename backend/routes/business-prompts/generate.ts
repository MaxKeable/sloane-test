import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import QuestionAnswer from "../../models/question-answer";
import User from "../../models/user";
import { Types } from "mongoose";
import { getUser } from "../../utils/getUser";

// Add interfaces
interface Question {
  _id: Types.ObjectId;
  text: string;
}

interface QuestionAnswer {
  _id: Types.ObjectId;
  answer: string;
  question: Question;
  user: Types.ObjectId;
}

const router = Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Keep OpenAI config for reference
// const openai = new OpenAIApi(
//   new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
//   })
// );

router.post("/", async (req, res) => {
  const { userId } = req.body;
  const user = await getUser(req, userId);

  try {
    const questionAnswers = (await QuestionAnswer.find({ user })
      .populate<{ question: Question }>("question")
      .exec()) as QuestionAnswer[];

    const questionsAndAnswers = questionAnswers
      .map((qa) => `Question: ${qa.question.text}\nAnswer: ${qa.answer}`)
      .join("\n\n");

    const prompt = `Based on the following questions and answers, create a comprehensive business profile summary:

${questionsAndAnswers}

Please create a detailed business profile that captures the key aspects of this business using the language and tone of the business.`;

    // Gemini implementation
    const result = await model.generateContent(prompt);
    const businessProfile = result.response.text();

    // Keep OpenAI implementation commented for reference
    // const response = await openai.createCompletion({
    //   model: "gpt-4",
    //   prompt,
    //   max_tokens: 1000,
    //   temperature: 0.7,
    // });
    // const businessProfile = response.data.choices[0].text.trim();

    await User.findByIdAndUpdate(user?._id, {
      onboardingCompleted: true,
      businessProfile: {
        businessDescription: businessProfile,
      },
    });

    res.json({ success: true, businessProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
