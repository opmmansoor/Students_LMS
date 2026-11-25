
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
      required: true,
      trim: true
    },

    admissionNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
      match: [
        /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      ]
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual field for full name
studentSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

export default mongoose.model("Student", studentSchema);
