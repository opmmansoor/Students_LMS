
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // Local version
    name: {
      type: String,
      trim: true,
      minlength: 2,
    },

    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    className: {
      type: String,
      trim: true,
    },

    discipline: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    attitude: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    status: {
      type: String,
      enum: ["Active", "TC", "Needs attention"],
      default: "Active",
    },

    // GitHub version
    firstName: {
      type: String,
      trim: true,
      minlength: 2,
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    class: {
      type: String,
      trim: true,
    },

    admissionNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
      match: [
        /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that a name and class are provided
studentSchema.pre("validate", function () {
  if (!this.name && !this.firstName) {
    this.invalidate("name", "Student name is required");
  }

  if (!this.className && !this.class) {
    this.invalidate("className", "Student class is required");
  }
});

// Virtual full name
studentSchema.virtual("fullName").get(function () {
  return this.name || `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

export default mongoose.model("Student", studentSchema);
