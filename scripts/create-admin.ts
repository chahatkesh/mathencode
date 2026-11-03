/**
 * Create the first admin account.
 *
 * Local (interactive):
 *   pnpm create-admin
 *
 * Local or production (non-interactive, no duplicate if the username exists):
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD=... pnpm create-admin
 *
 * Required in `.env.local` or the environment:
 *   MONGODB_URI, ADMIN_SETUP_SECRET
 */

import { timingSafeEqual } from "crypto";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import readline from "readline";

const MONGODB_URI = process.env.MONGODB_URI;
const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET;

interface IAdmin {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

const Admin =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

function fail(message: string): never {
  throw new Error(message);
}

function assertEnvironment() {
  if (!MONGODB_URI) {
    fail(
      "MONGODB_URI is missing. Add it to .env.local (local) or the process environment (production).",
    );
  }
  if (
    !MONGODB_URI.startsWith("mongodb://") &&
    !MONGODB_URI.startsWith("mongodb+srv://")
  ) {
    fail("MONGODB_URI must be a MongoDB connection string.");
  }
  if (!SETUP_SECRET || SETUP_SECRET.length < 16) {
    fail(
      "ADMIN_SETUP_SECRET is missing or shorter than 16 characters. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
}

function secretsMatch(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function question(rl: readline.Interface, query: string) {
  return new Promise<string>((done) => {
    rl.question(query, done);
  });
}

async function upsertAdmin(
  username: string,
  password: string,
  overwrite: boolean,
) {
  const existing = await Admin.findOne({ username });
  if (existing && !overwrite) {
    console.log(
      `Admin "${username}" already exists. No duplicate account was created.`,
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if (existing) {
    await Admin.updateOne({ username }, { password: hashedPassword });
    console.log(`Admin "${username}" password updated.`);
    return;
  }

  try {
    await Admin.create({ username, password: hashedPassword });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      console.log(
        `Admin "${username}" already exists. No duplicate account was created.`,
      );
      return;
    }
    throw error;
  }

  console.log(`Admin "${username}" created.`);
}

async function createAdmin() {
  assertEnvironment();

  const envUsername = process.env.ADMIN_USERNAME?.trim();
  const envPassword = process.env.ADMIN_PASSWORD;
  const nonInteractive = Boolean(envUsername || envPassword);

  if (nonInteractive && (!envUsername || !envPassword)) {
    fail("Set both ADMIN_USERNAME and ADMIN_PASSWORD, or neither for prompts.");
  }
  if (envPassword && envPassword.length < 6) {
    fail("ADMIN_PASSWORD must be at least 6 characters.");
  }

  if (!MONGODB_URI) fail("MONGODB_URI is not defined.");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  if (envUsername && envPassword) {
    await upsertAdmin(envUsername, envPassword, false);
    console.log("You can sign in at /admin.");
    return;
  }

  if (!process.stdin.isTTY) {
    fail(
      "No interactive terminal. Set ADMIN_USERNAME and ADMIN_PASSWORD to seed without prompts.",
    );
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const providedSecret = await question(rl, "Enter admin setup secret: ");
    if (!SETUP_SECRET || !secretsMatch(providedSecret.trim(), SETUP_SECRET)) {
      fail("Setup secret did not match ADMIN_SETUP_SECRET.");
    }

    const username = (await question(rl, "Enter admin username: ")).trim();
    if (!username) fail("Username cannot be empty.");

    const existing = await Admin.findOne({ username });
    let overwrite = false;
    if (existing) {
      const answer = await question(
        rl,
        `User "${username}" already exists. Update the password? (yes/no): `,
      );
      if (answer.toLowerCase() !== "yes") {
        console.log("No changes made.");
        return;
      }
      overwrite = true;
    }

    const password = await question(rl, "Enter admin password: ");
    if (!password || password.length < 6) {
      fail("Password must be at least 6 characters.");
    }
    const confirmPassword = await question(rl, "Confirm password: ");
    if (password !== confirmPassword) fail("Passwords do not match.");

    await upsertAdmin(username, password, overwrite);
    console.log("You can sign in at /admin.");
    console.log(`Username: ${username}`);
  } finally {
    rl.close();
  }
}

createAdmin()
  .catch((error) => {
    console.error("Error creating admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
