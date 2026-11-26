import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  points: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  teacher: { type: String, default: "", trim: true },
  note: { type: String, default: "", trim: true },
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
