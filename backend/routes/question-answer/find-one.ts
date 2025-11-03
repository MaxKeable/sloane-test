import express from "express";
import QuestionAnswer from "../../models/question-answer";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const questionAnswer = await QuestionAnswer.findById(id);

  if (!questionAnswer) {
    return res.status(404).json({ message: "Question answer not found" });
  }

  res.json(questionAnswer);
});

export default router;
