
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    points: {
      type: Number,
      required: true,
      min: 0
    },

    date: {
      type: Date,
      required: true,
      default: Date.now
    },

    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Activity", activitySchema);
