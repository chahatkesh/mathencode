/**
 * Runtime environment variable validation.
 *
 * Import this module from a server entry (the root layout) so a missing
 * MongoDB URI or session secret fails immediately instead of inside a request.
 */

import "server-only";
import { z } from "zod/v4";

const serverSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .refine(
      (value) =>
        value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGODB_URI must be a MongoDB connection string",
    ),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  ADMIN_SETUP_SECRET: z
    .string()
    .min(16, "ADMIN_SETUP_SECRET must be at least 16 characters")
    .optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const processEnv = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_SETUP_SECRET: process.env.ADMIN_SETUP_SECRET || undefined,
  NODE_ENV: process.env.NODE_ENV,
};

type Env = z.infer<typeof serverSchema>;

function validateEnv(): Env {
  if (
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return processEnv as unknown as Env;
  }

  const parsed = serverSchema.safeParse(processEnv);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      z.prettifyError(parsed.error),
    );
    throw new Error(
      "Invalid environment variables. Check server logs for details.",
    );
  }

  return parsed.data;
}

export const env = validateEnv();
