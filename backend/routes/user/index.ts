import express from "express";
import getMe from "./getMe";

const router = express.Router();

router.use("/get-me", getMe);

export default router;
