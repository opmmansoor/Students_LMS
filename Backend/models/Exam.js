
import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    examName: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    marks: {
      type: Number,
      required: true,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

examSchema.pre("validate", function () {
  if (this.marks > this.total) {
    this.invalidate("marks", "Marks cannot exceed total marks");
  }
});

export default mongoose.model("Exam", examSchema);
