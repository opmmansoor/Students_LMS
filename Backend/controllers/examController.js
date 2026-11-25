
import mongoose from "mongoose";

import Exam from "../models/Exam.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

// GET all exams
export const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find()
    .populate("studentId", "firstName lastName class")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: exams.length,
    data: exams
  });
});

// GET single exam
export const getExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid exam ID");
  }

  const exam = await Exam.findById(id)
    .populate("studentId", "firstName lastName class");

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    success: true,
    data: exam
  });
});

// CREATE exam
export const createExam = asyncHandler(async (req, res) => {
  const {
    studentId,
    examName,
    subject,
    date,
    marks,
    total
  } = req.body;

  if (!mongoose.isValidObjectId(studentId)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await Student.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const exam = await Exam.create({
    studentId,
    examName,
    subject,
    date,
    marks,
    total
  });

  res.status(201).json({
    success: true,
    data: exam
  });
});

// UPDATE exam
export const updateExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid exam ID");
  }

  const allowedFields = [
    "studentId",
    "examName",
    "subject",
    "date",
    "marks",
    "total"
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (updates.studentId !== undefined) {
    if (!mongoose.isValidObjectId(updates.studentId)) {
      res.status(400);
      throw new Error("Invalid student ID");
    }

    const student = await Student.findById(updates.studentId);

    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }
  }

  const exam = await Exam.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).populate("studentId", "firstName lastName class");

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    success: true,
    data: exam
  });
});

// DELETE exam
export const deleteExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid exam ID");
  }

  const exam = await Exam.findByIdAndDelete(id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    success: true,
    message: "Exam deleted successfully"
  });
});
