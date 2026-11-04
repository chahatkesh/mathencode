import mongoose, { type InferSchemaType } from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    selectedIndex: { type: Number, default: null },
  },
  { _id: false },
);

const resultSchema = new mongoose.Schema(
  {
    totalQuestions: { type: Number, required: true },
    correct: { type: Number, required: true },
    incorrect: { type: Number, required: true },
    unanswered: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { _id: false },
);

const snapshotSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    prompt: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    selectedIndex: { type: Number, default: null },
    explanation: { type: String, default: "" },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false },
);

const diagnosticSubmissionSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["course", "common"],
      default: "course",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiagnosticTest",
      required: true,
    },
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiagnosticAttempt",
      required: true,
      unique: true,
    },
    studentName: { type: String, required: true, trim: true, maxlength: 200 },
    contactNumber: { type: String, required: true, trim: true, maxlength: 40 },
    countryCode: { type: String, required: true, trim: true, maxlength: 8 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    courseTitle: { type: String, required: true, trim: true, maxlength: 200 },
    testTitle: { type: String, required: true, trim: true, maxlength: 200 },
    durationSeconds: { type: Number, min: 0 },
    timeLimitMinutes: { type: Number, min: 1, max: 180 },
    answers: { type: [answerSchema], required: true },
    results: { type: resultSchema, required: true },
    questions: { type: [snapshotSchema], required: true },
  },
  { timestamps: true },
);

diagnosticSubmissionSchema.index({ scope: 1, createdAt: -1 });
diagnosticSubmissionSchema.index({ course: 1, createdAt: -1 });
diagnosticSubmissionSchema.index({ createdAt: -1 });
diagnosticSubmissionSchema.index({ "results.percentage": 1 });

export type IDiagnosticSubmission = InferSchemaType<
  typeof diagnosticSubmissionSchema
> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

if (mongoose.models.DiagnosticSubmission) {
  mongoose.deleteModel("DiagnosticSubmission");
}

const DiagnosticSubmission = mongoose.model<IDiagnosticSubmission>(
  "DiagnosticSubmission",
  diagnosticSubmissionSchema,
);

export default DiagnosticSubmission;
