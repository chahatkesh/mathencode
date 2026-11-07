import mongoose from "mongoose";

export type FormSubmissionKind = "demo" | "mentorship";

export interface IFormSubmission {
  name: string;
  email: string;
  contactNumber: string;
  countryCode: string;
  country?: string;
  message: string;
  goals?: string;
  expectations?: string;
  sourceCourse?: string;
  kind: FormSubmissionKind;
  isRead: boolean;
  contacted: boolean;
  createdAt: Date;
}

const formSubmissionSchema = new mongoose.Schema<IFormSubmission>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  countryCode: { type: String, required: false, default: "+1" },
  country: { type: String, required: false, default: "" },
  message: { type: String, required: true },
  goals: { type: String, required: false, default: "" },
  expectations: { type: String, required: false, default: "" },
  sourceCourse: { type: String, required: false, default: "" },
  kind: {
    type: String,
    enum: ["demo", "mentorship"],
    required: false,
    default: "demo",
  },
  isRead: { type: Boolean, default: false },
  contacted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Keep the original model name so existing `formdatas` documents are reused.
// Drop a hot-reloaded model that predates mentorship fields.
if (mongoose.models.FormData && !mongoose.models.FormData.schema.path("kind")) {
  delete mongoose.models.FormData;
}

const FormSubmission =
  mongoose.models.FormData ||
  mongoose.model<IFormSubmission>("FormData", formSubmissionSchema);

export default FormSubmission;
