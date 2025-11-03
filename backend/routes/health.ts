import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    checks: {
      database:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      memory: process.memoryUsage(),
    },
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = "ERROR";
    res.status(503).json(healthCheck);
  }
});

export default router;
