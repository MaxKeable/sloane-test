import express from "express";
import QuestionAnswer from "../../models/question-answer";
import mongoose from "mongoose";

const router = express.Router();

const seedData = [
  {
    answer: "I'm a software engineer",
    user: new mongoose.Types.ObjectId("678352a40c74ad9f6da6b4bc"),
    question: new mongoose.Types.ObjectId("678352a40c74ad9f6da6b4bd"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    answer: "I quit my job",
    user: new mongoose.Types.ObjectId("678352a40c74ad9f6da6b4be"),
    question: new mongoose.Types.ObjectId("678352a40c74ad9f6da6b4bf"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedQuestionAnswers = async () => {
  try {
    // Clear existing data
    await QuestionAnswer.deleteMany({});

    // Insert new data
    await QuestionAnswer.insertMany(seedData);

    console.log("Question answers seeded successfully!");
  } catch (error) {
    console.error("Error seeding question answers:", error);
  }
};

router.post("/", async (req, res) => {
  await seedQuestionAnswers();
  res.json({ message: "Question answers seeded" });
});

export default router;
