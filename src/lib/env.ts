import { z } from "zod";
import { config } from "dotenv";
config({ path: ".env.local" });

export const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, "PORT must be a number").optional(),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  NODE_ENV: z
    .enum(["development", "production", "test"], {
      message: "NODE_ENV must be one of 'development', 'production', or 'test'",
    })
    .optional(),
});

export const env = envSchema.parse(process.env);
