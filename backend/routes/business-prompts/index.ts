import { Router } from "express";
import generate from "./generate";

const router = Router();

router.use("/generate", generate);

export default router;
