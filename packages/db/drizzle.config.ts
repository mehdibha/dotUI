import { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

export default {
  schema: "./src/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.POSTGRES_URL },
  casing: "snake_case",
} satisfies Config;
