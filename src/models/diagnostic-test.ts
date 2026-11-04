import mongoose, { type InferSchemaType } from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, default: "", maxlength: 2000 },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options: string[]) => options.length === 4,
        message: "Each question needs four options",
      },
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: "", maxlength: 2000 },
  },
  { _id: true },
);

const diagnosticTestSchema = new mongoose.Schema(
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
      unique: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    instructions: { type: String, default: "", maxlength: 4000 },
    timeLimitMinutes: { type: Number, min: 1, max: 180 },
    published: { type: Boolean, default: false, index: true },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true },
);

export type IDiagnosticQuestion = InferSchemaType<typeof questionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type IDiagnosticTest = InferSchemaType<typeof diagnosticTestSchema> & {
  _id: mongoose.Types.ObjectId;
  questions: IDiagnosticQuestion[];
  createdAt: Date;
  updatedAt: Date;
};

diagnosticTestSchema.index(
  { scope: 1 },
  { unique: true, partialFilterExpression: { scope: "common" } },
);

if (mongoose.models.DiagnosticTest) {
  mongoose.deleteModel("DiagnosticTest");
}

const DiagnosticTest = mongoose.model<IDiagnosticTest>(
  "DiagnosticTest",
  diagnosticTestSchema,
);

export default DiagnosticTest;
