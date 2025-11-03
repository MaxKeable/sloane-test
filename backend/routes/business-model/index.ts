import express from "express";
import getUserBusinessModel from "./get-user-business-model";

const router = express.Router();

router.use("/", getUserBusinessModel);

export default router; 