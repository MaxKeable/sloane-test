import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Use console.log here since Winston logger depends on this config
console.log("=".repeat(50));
console.log("Loading environment configuration...");
console.log(`NODE_ENV: ${process.env.NODE_ENV || "not set (will default to development)"}`);
console.log(`PORT: ${process.env.PORT || "not set (will default to 3001)"}`);
console.log(`CLERK_PUBLISHABLE_KEY: ${process.env.CLERK_PUBLISHABLE_KEY ? "✓ set" : "✗ NOT SET (REQUIRED)"}`);
console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? "✓ set" : "✗ NOT SET (REQUIRED)"}`);
console.log(`ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? "✓ set" : "✗ not set (optional)"}`);
console.log(`GOOGLE_GENERATIVE_AI_API_KEY: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "✓ set" : "✗ not set (optional)"}`);
console.log(`MONGO_URI: ${process.env.MONGO_URI ? "✓ set" : "✗ not set"}`);
console.log(`DEV_MONGO_URI: ${process.env.DEV_MONGO_URI ? "✓ set" : "✗ not set"}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || "not set (optional)"}`);
console.log(`LOG_LEVEL: ${process.env.LOG_LEVEL || "not set (will default to info)"}`);
console.log("=".repeat(50));

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

let parsedConfig: z.infer<typeof configSchema>;

try {
  parsedConfig = configSchema.parse(process.env);
  console.log("✓ Environment configuration validated successfully");
  console.log("=".repeat(50));
} catch (error) {
  console.error("=".repeat(50));
  console.error("✗ Environment configuration validation FAILED:");
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
  } else {
    console.error(error);
  }
  console.error("=".repeat(50));
  throw error;
}

// Use DEV_MONGO_URI in development, MONGO_URI in production
const mongoUri =
  parsedConfig.NODE_ENV === "development"
    ? parsedConfig.DEV_MONGO_URI
    : parsedConfig.MONGO_URI;

if (!mongoUri) {
  const errorMessage =
    parsedConfig.NODE_ENV === "development"
      ? "DEV_MONGO_URI is required in development mode"
      : "MONGO_URI is required in production mode";
  console.error("=".repeat(50));
  console.error(`✗ Database configuration error: ${errorMessage}`);
  console.error("=".repeat(50));
  throw new Error(errorMessage);
}

console.log(`✓ Using MongoDB URI for ${parsedConfig.NODE_ENV} environment`);

const config = {
  ...parsedConfig,
  MONGO_URI: mongoUri,
};

export default config;
