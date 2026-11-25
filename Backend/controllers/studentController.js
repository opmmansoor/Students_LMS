
import mongoose from "mongoose";

import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all students
export const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// GET single student
export const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await Student.findById(id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// CREATE student
export const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);

  res.status(201).json({
    success: true,
    data: student
  });
});

// UPDATE student
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await Student.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// DELETE student
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await Student.findByIdAndDelete(id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.status(200).json({
    success: true,
    message: "Student deleted successfully"
  });
});
