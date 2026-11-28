
import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Validate marks
examSchema.pre("validate", function () {
  if (this.marks > this.total) {
    this.invalidate(
      "marks",
      "Marks cannot exceed total marks"
    );
  }
});

// Percentage
examSchema.virtual("percentage").get(function () {
  return Number(
    ((this.marks / this.total) * 100).toFixed(2)
  );
});

// Pass / Fail
examSchema.virtual("status").get(function () {
  return (this.marks / this.total) * 100 >= 40
    ? "Pass"
    : "Fail";
});

export default mongoose.model("Exam", examSchema);
