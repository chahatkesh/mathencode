import mongoose, { type InferSchemaType } from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    publicId: { type: Number, required: true, unique: true },
    slug: { type: String, trim: true, maxlength: 80 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    startDate: { type: Date, default: null },
    topics: {
      type: [String],
      default: [],
      validate: {
        validator(topics: string[]) {
          return (
            topics.length <= 40 &&
            topics.every(
              (topic) => topic.trim().length > 0 && topic.length <= 200,
            )
          );
        },
        message:
          "A course can have at most 40 topics, each up to 200 characters",
      },
    },
    batchSize: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 5,
    },
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
