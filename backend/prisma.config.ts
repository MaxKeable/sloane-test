import path from "node:path";
import dotenv from "dotenv";
import type { PrismaConfig } from "prisma";

const here = __dirname;
dotenv.config({ path: path.join(here, ".env") });
dotenv.config({ path: path.join(here, "..", ".env") });

export default {
  schema: path.join("src", "model", "db", "schema.prisma"),
  migrations: {
    path: path.join("..", "migrations"),
  },
  views: {
    path: path.join("src", "model", "db", "views"),
  },
  typedSql: {
    path: path.join("src", "model", "db", "queries"),
  },
} satisfies PrismaConfig;
