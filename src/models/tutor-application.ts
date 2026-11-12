import mongoose from "mongoose";

export const TUTOR_APPLICATION_STATUSES = [
  "pending",
  "reviewing",
  "interviewed",
  "accepted",
  "rejected",
] as const;

export type TutorApplicationStatus =
  (typeof TUTOR_APPLICATION_STATUSES)[number];

export interface ITutorApplication {
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: TutorApplicationStatus;
  createdAt: Date;
}

const tutorApplicationSchema = new mongoose.Schema<ITutorApplication>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  status: {
    type: String,
    enum: TUTOR_APPLICATION_STATUSES,
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

tutorApplicationSchema.index({ createdAt: -1 });

const TutorApplication =
  mongoose.models.TutorApplication ||
  mongoose.model<ITutorApplication>("TutorApplication", tutorApplicationSchema);

export default TutorApplication;
