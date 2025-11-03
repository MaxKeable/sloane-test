import express from "express";
import createVideo from "./create-video";
import getVideos from "./get-videos";
import updateVideo from "./update-video";
import deleteVideo from "./delete-video";

const router = express.Router();

router.use("/", getVideos);
router.use("/", createVideo);
router.use("/", updateVideo);
router.use("/", deleteVideo);

export default router; 