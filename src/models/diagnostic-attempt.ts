import mongoose, { type InferSchemaType } from "mongoose";

const diagnosticAttemptSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    scope: {
      type: String,
      enum: ["course", "common"],
      default: "course",
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
      index: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiagnosticTest",
      required: true,
    },
    questionIds: { type: [String], required: true },
    startedAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

diagnosticAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type IDiagnosticAttempt = InferSchemaType<
  typeof diagnosticAttemptSchema
> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

if (mongoose.models.DiagnosticAttempt) {
  mongoose.deleteModel("DiagnosticAttempt");
}

const DiagnosticAttempt = mongoose.model<IDiagnosticAttempt>(
  "DiagnosticAttempt",
  diagnosticAttemptSchema,
);

export default DiagnosticAttempt;
