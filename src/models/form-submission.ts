import mongoose from "mongoose";

export interface IFormSubmission {
  name: string;
  email: string;
  contactNumber: string;
  countryCode: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const formSubmissionSchema = new mongoose.Schema<IFormSubmission>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  countryCode: { type: String, required: false, default: "+1" },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Keep the original model name so existing `formdatas` documents are reused.
const FormSubmission =
  mongoose.models.FormData ||
  mongoose.model<IFormSubmission>("FormData", formSubmissionSchema);

export default FormSubmission;
