import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  code: { type: String, required: true, trim: true, unique: true },
  className: { type: String, required: true, trim: true },
  discipline: { type: Number, min: 1, max: 5, default: 3 },
  attitude: { type: Number, min: 1, max: 5, default: 3 },
  status: { type: String, enum: ["Active", "TC", "Needs attention"], default: "Active" },
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
