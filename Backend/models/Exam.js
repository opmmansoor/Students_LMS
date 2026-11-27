
import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Support both examName and exam
    examName: {
      type: String,
      trim: true,
      default: "",
    },

    exam: {
      type: String,
      trim: true,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 1,
    },

    remark: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate exam name
examSchema.pre("validate", function () {
  if (!this.examName && !this.exam) {
    this.invalidate("examName", "Exam name is required");
  }

  if (this.marks > this.total) {
    this.invalidate("marks", "Marks cannot exceed total marks");
  }
});

// Virtual percentage
examSchema.virtual("percentage").get(function () {
  return Number(((this.marks / this.total) * 100).toFixed(2));
});

// Virtual pass/fail status (40% pass mark)
examSchema.virtual("status").get(function () {
  return (this.marks / this.total) * 100 >= 40
    ? "Pass"
    : "Fail";
});

export default mongoose.model("Exam", examSchema);
