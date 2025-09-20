import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  ssl: "require",
});
export const db = drizzle(sql);
