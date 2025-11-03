import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGO_URI: z.string().optional(),
  DEV_MONGO_URI: z.string().optional(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  LOG_LEVEL: z.string().default("info"),
});

const parsedConfig = configSchema.parse(process.env);

// Use DEV_MONGO_URI in development, MONGO_URI in production
const mongoUri =
  parsedConfig.NODE_ENV === "development"
    ? parsedConfig.DEV_MONGO_URI
    : parsedConfig.MONGO_URI;

if (!mongoUri) {
  throw new Error(
    parsedConfig.NODE_ENV === "development"
      ? "DEV_MONGO_URI is required in development mode"
      : "MONGO_URI is required in production mode"
  );
}

const config = {
  ...parsedConfig,
  MONGO_URI: mongoUri,
};

export default config;
