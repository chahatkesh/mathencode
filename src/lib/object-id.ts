import mongoose from "mongoose";

export function toObjectId(value: string) {
  if (!mongoose.Types.ObjectId.isValid(value)) return null;
  const id = new mongoose.Types.ObjectId(value);
  return String(id) === value ? id : null;
}
