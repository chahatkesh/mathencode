import { z } from "zod/v4";
import { findCountryByName } from "~/data/countries";

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

export const courseAccentSchema = z.enum([
  "primary",
  "secondary",
  "purple",
  "accent",
  "orange",
]);

const courseLineSchema = z.string().trim().min(1).max(300);

export const courseInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  level: z.string().trim().min(1, "Grade level is required").max(120),
  duration: z.string().trim().min(1, "Duration is required").max(120),
  group: z.string().trim().min(1, "Class size is required").max(120),
  highlights: z
    .array(courseLineSchema)
    .min(1, "Add at least one topic")
    .max(40),
  objectives: z
    .array(courseLineSchema)
    .min(1, "Add at least one learning objective")
    .max(30),
  prerequisites: z
    .string()
    .trim()
    .min(1, "Prerequisites are required")
    .max(1000),
  schedule: z.string().trim().min(1, "Schedule is required").max(300),
  nextStart: z.string().trim().min(1, "Next start is required").max(120),
  accent: courseAccentSchema,
  visible: z.boolean(),
});

export const courseVisibilitySchema = z.object({
  visible: z.boolean(),
});

export const testQuestionInputSchema = z.object({
  id: z.string().trim().max(40).optional(),
  prompt: z.string().trim().max(2000),
  options: z
    .array(z.string().trim().max(500))
    .length(4, "Each question needs four options"),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().trim().max(2000).optional().default(""),
});

export const testInputSchema = z.object({
  title: z.string().trim().min(1, "Test title is required").max(200),
  instructions: z.string().trim().max(4000).optional().default(""),
  timeLimitMinutes: z
    .number()
    .int("Time limit must be a whole number of minutes")
    .min(1, "Set a time limit of at least 1 minute")
    .max(180, "Time limit cannot be more than 180 minutes"),
  published: z.boolean(),
  questions: z.array(testQuestionInputSchema).max(80),
});

export const testPublishSchema = z.object({
  published: z.boolean(),
});

export type CourseInput = z.infer<typeof courseInputSchema>;
export type TestInput = z.infer<typeof testInputSchema>;

export function publishBlockReason(input: {
  title: string;
  timeLimitMinutes?: number | null;
  questions: Array<{
    prompt: string;
    options: string[];
    correctIndex: number;
  }>;
}) {
  if (!input.title.trim()) return "Test title is required";
  if (
    !Number.isInteger(input.timeLimitMinutes) ||
    (input.timeLimitMinutes ?? 0) < 1 ||
    (input.timeLimitMinutes ?? 0) > 180
  ) {
    return "Set a time limit between 1 and 180 minutes";
  }
  if (input.questions.length === 0) {
    return "Add at least one question before publishing";
  }

  for (const [index, question] of input.questions.entries()) {
    const label = `Question ${index + 1}`;
    if (!question.prompt.trim()) return `${label} needs question text`;
    if (
      question.options.length !== 4 ||
      question.options.some((option) => !option.trim())
    ) {
      return `${label} needs four answer options`;
    }
    if (
      !Number.isInteger(question.correctIndex) ||
      question.correctIndex < 0 ||
      question.correctIndex > 3
    ) {
      return `${label} needs one correct answer`;
    }
  }

  return null;
}

export const diagnosticSubmitSchema = z.object({
  attemptToken: z
    .string()
    .trim()
    .regex(
      /^[a-f0-9]{64}$/,
      "This attempt is no longer valid. Start the test again.",
    ),
  studentName: z.string().trim().min(1, "Enter your full name").max(200),
  country: z.string().trim().min(1, "Select your country").max(80),
  countryCode: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Select a valid country code"),
  contactNumber: z.string().trim().min(1, "Contact number is required").max(24),
  answers: z
    .array(
      z.object({
        questionId: z.string().trim().min(1).max(40),
        selectedIndex: z.number().int().min(0).max(3).nullable(),
      }),
    )
    .max(80),
});

export type DiagnosticSubmitInput = z.infer<typeof diagnosticSubmitSchema>;

export function normalizeStudentName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function studentContactError(input: {
  studentName: string;
  country: string;
  countryCode: string;
  contactNumber: string;
}) {
  const name = normalizeStudentName(input.studentName);
  if (!/^\p{L}[\p{L}\s.'-]{1,199}$/u.test(name)) {
    return "Enter your full name";
  }

  const country = findCountryByName(input.country.trim());
  if (!country || country.code !== input.countryCode.trim()) {
    return "Select your country";
  }

  const digits = input.contactNumber.replace(/\D/g, "");
  const codeDigits = country.code.replace(/\D/g, "");
  if (
    digits.length < 6 ||
    digits.length > 14 ||
    codeDigits.length + digits.length > 15
  ) {
    return "Enter a valid contact number";
  }

  return null;
}

export function formatContactNumber(
  countryCode: string,
  contactNumber: string,
) {
  return `${countryCode} ${contactNumber.replace(/\D/g, "")}`;
}
