import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI && process.env.NODE_ENV !== "production") {
  console.warn(
    "Warning: MONGODB_URI environment variable is not defined. Database features will be disabled.",
  );
} else if (!MONGODB_URI && typeof window === "undefined") {
  console.warn(
    "MongoDB URI not configured. Database features will be disabled.",
  );
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: ConnectionCache | undefined;
}

const cached: ConnectionCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

// A failed connect used to stay cached for the life of the process, so a
// transient DNS error kept failing every request. Drop a promise that never
// produced a connection (including one left behind by hot reload).
if (cached.promise && !cached.conn) {
  cached.promise = null;
}

async function dbConnect() {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((connection) => connection)
      .catch((error: unknown) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function getMongoDBUri(context = "API route"): string | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      `MONGODB_URI environment variable is not defined (${context})`,
    );
    return null;
  }
  return uri;
}

export async function ensureDb(context = "API route") {
  const uri = getMongoDBUri(context);
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  const connection = await dbConnect();
  if (!connection) {
    throw new Error("Failed to connect to MongoDB");
  }

  return connection;
}

export default dbConnect;
