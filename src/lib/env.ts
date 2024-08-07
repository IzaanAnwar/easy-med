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
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
