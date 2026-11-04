import mongoose, { type InferSchemaType } from "mongoose";

const colorSchemeSchema = new mongoose.Schema(
  {
    gradient: { type: String, required: true },
    accent: {
      type: String,
      required: true,
      enum: ["primary", "secondary", "purple", "accent", "orange"],
    },
    bg: { type: String, required: true },
    border: { type: String, required: true },
  },
  { _id: false },
);

const courseSchema = new mongoose.Schema(
  {
    publicId: { type: Number, required: true, unique: true },
    slug: { type: String, trim: true, maxlength: 80 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    level: { type: String, required: true, trim: true, maxlength: 120 },
    duration: { type: String, required: true, trim: true, maxlength: 120 },
    group: { type: String, required: true, trim: true, maxlength: 120 },
    highlights: { type: [String], required: true },
    colorScheme: { type: colorSchemeSchema, required: true },
    objectives: { type: [String], required: true },
    prerequisites: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    schedule: { type: String, required: true, trim: true, maxlength: 300 },
    nextStart: { type: String, required: true, trim: true, maxlength: 120 },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

courseSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { slug: { $type: "string" } } },
);
export type ICourse = InferSchemaType<typeof courseSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

if (mongoose.models.Course) {
  mongoose.deleteModel("Course");
}

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
