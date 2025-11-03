import express from "express";
import seedQuestionAnswer from "./seed-question-answer";
import getOneByQuestionId from "./get-one-by-question-id";
import findOne from "./find-one";
import list from "./list";
import create from "./create";
import update from "./update";

const router = express.Router();

router.use("/seed", seedQuestionAnswer);
router.use("/get-by-question-id", getOneByQuestionId);
router.use("/", findOne);
router.use("/", list);
router.use("/", create);
router.use("/", update);

export default router;
