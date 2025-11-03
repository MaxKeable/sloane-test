import express from "express";
import mongoose from "mongoose";
import prisma from "../config/client";
import config from "../config/index";

const router = express.Router();

router.get("/", async (req, res) => {
  const checks: any = {
    database: {
      mongoose: {
        status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        readyState: mongoose.connection.readyState,
        dbName: mongoose.connection.db?.databaseName || "unknown",
      },
      prisma: {
        status: "unknown",
      },
    },
    memory: process.memoryUsage(),
    environment: config.NODE_ENV,
  };

  // Check Prisma connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database.prisma.status = "connected";
  } catch (error) {
    checks.database.prisma.status = "disconnected";
    checks.database.prisma.error =
      error instanceof Error ? error.message : String(error);
  }

  // Determine overall health status
  const isMongooseHealthy = checks.database.mongoose.status === "connected";
  const isPrismaHealthy = checks.database.prisma.status === "connected";
  const isHealthy = isMongooseHealthy && isPrismaHealthy;

  const healthCheck = {
    status: isHealthy ? "healthy" : "degraded",
    uptime: process.uptime(),
    message: isHealthy ? "OK" : "DEGRADED",
    timestamp: Date.now(),
    version: process.env.npm_package_version || "unknown",
    checks,
  };

  try {
    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    healthCheck.message = "ERROR";
    healthCheck.status = "unhealthy";
    res.status(503).json(healthCheck);
  }
});

export default router;
