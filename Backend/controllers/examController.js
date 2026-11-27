
import mongoose from "mongoose";
import Exam from "../models/Exam.js";
import Student from "../models/Student.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Allowed fields
const allowedFields = [
  "studentId",
  "examName",
  "exam",
  "subject",
  "date",
  "marks",
  "total",
  "remark",
];

// Pick allowed fields only
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
    throw new Error("Invalid exam ID");
  }
};

// GET all exams
export const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find()
    .populate("studentId", "firstName lastName class")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: exams.length,
    data: exams,
  });
});

// GET single exam
export const getExam = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);

  const exam = await Exam.findById(req.params.id)
    .populate("studentId", "firstName lastName class");

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    success: true,
    data: exam,
  });
});

// CREATE exam
export const createExam = asyncHandler(async (req, res) => {
  const data = pick(req.body);

  if (!mongoose.isValidObjectId(data.studentId)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await Student.findById(data.studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const exam = await Exam.create(data);

  res.status(201).json({
    success: true,
    data: exam,
  });
});

// UPDATE exam
export const updateExam = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);

  const updates = pick(req.body);

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
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).populate("studentId", "firstName lastName class");

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    success: true,
    data: exam,
  });
});

// DELETE exam
export const deleteExam = asyncHandler(async (req, res) => {
  validateId(req.params.id, res);

  const exam = await Exam.findByIdAndDelete(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    success: true,
    message: "Exam deleted successfully",
  });
});
