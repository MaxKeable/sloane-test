import express from "express";
import getQuestions from "./get-questions";
import seedQuestions from "./seedQuestions";
import createQuestion from "./create-question";
import updateQuestion from "./update-question";
import findOne from "./find-one";
import remove from "./remove";
const router = express.Router();

router.use("/", getQuestions);
router.use("/seed", seedQuestions);
router.use("/", createQuestion);
router.use("/", updateQuestion);
router.use("/", findOne);
router.use("/", remove);

export default router;
