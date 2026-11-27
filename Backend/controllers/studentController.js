
import mongoose from "mongoose";

import Student from "../models/Student.js";
import Activity from "../models/Activity.js";
import Exam from "../models/Exam.js";
import asyncHandler from "../middleware/asyncHandler.js";

const allowedFields = [
  "name",
  "code",
  "className",
  "discipline",
  "attitude",
  "status",
];

// Allow only approved fields
const pick = (body) =>
  Object.fromEntries(
    allowedFields
      .filter((key) => body[key] !== undefined)
      .map((key) => [key, body[key]])
  );

// Validate MongoDB ID
const validateId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }
};

// GET all students
export const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// GET single student
export const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateId(id, res);

  const student = await Student.findById(id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// CREATE student
export const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(pick(req.body));

  res.status(201).json({
    success: true,
    data: student,
  });
});

// UPDATE student
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateId(id, res);

  const student = await Student.findByIdAndUpdate(
    id,
    pick(req.body),
    {
      new: true,
      runValidators: true,
    }
  );

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// DELETE student
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateId(id, res);

  const student = await Student.findByIdAndDelete(id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // Delete related activities and exams
  await Promise.all([
    Activity.deleteMany({ studentId: student._id }),
    Exam.deleteMany({ studentId: student._id }),
  ]);

  res.status(200).json({
    success: true,
    message: "Student and related records deleted successfully",
  });
});
