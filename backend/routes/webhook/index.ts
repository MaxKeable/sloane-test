import express from "express";
import clerk from "./clerk";

const router = express.Router();

router.use("/clerk", clerk);

export default router;
