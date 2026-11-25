
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true
    },

    lastName: {
      type: String,
      trim: true,
      default: ""
    },

    class: {
      type: String,
      required: true
    },

    admissionNumber: {
      type: String,
      unique: true,
      sparse: true
    },

    email: {
      type: String,
      lowercase: true,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

studentSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

export default mongoose.model("Student", studentSchema);
