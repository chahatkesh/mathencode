import { z } from "zod/v4";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(100, "Username too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(200, "Password too long"),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "All fields are required").max(200),
  email: z.string().trim().email("A valid email is required").max(200),
  contactNumber: z.string().trim().min(1, "All fields are required").max(40),
  countryCode: z.string().trim().max(8).optional(),
  message: z.string().trim().min(1, "All fields are required").max(5000),
});

export const tutorApplicationSchema = z.object({
  name: z.string().trim().min(1, "All fields are required").max(200),
  email: z.string().trim().email("A valid email is required").max(200),
  contactNumber: z.string().trim().min(1, "All fields are required").max(40),
  subject: z.string().trim().min(1, "All fields are required").max(200),
  message: z.string().trim().min(1, "All fields are required").max(5000),
});

export const applicationStatusSchema = z.object({
  status: z.enum([
    "pending",
    "reviewing",
    "interviewed",
    "accepted",
    "rejected",
  ]),
});

export const TUTOR_STATUSES = applicationStatusSchema.shape.status.options;
