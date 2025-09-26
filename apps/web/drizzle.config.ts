import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";
import path from "path";

// Try .env.local first (common), then .env
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });
loadEnv();

export default {
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
